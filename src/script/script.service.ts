import { HttpException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, DeepPartial } from 'typeorm';
import { Script } from './entities/script.entity';
import { CreateScriptDto } from './dto/create-script.dto';
import { UpdateScriptDto } from './dto/update-script.dto';
import yahooFinance from 'yahoo-finance2';
import axios from 'axios';
import * as csv from 'csv-parser';
import { Readable } from 'stream';
import { ConfigService } from '@nestjs/config';
export interface StockData {
  name: string;
  current_rate?: number;
  high_value?: number;
  low_value?: number;
  volume?: number;
  closing_price?: number;
  create_date: Date;
  updated_date: Date;
  type: string;
  status: boolean;
  symbol: string;
}
yahooFinance.suppressNotices(['yahooSurvey']);
@Injectable()
export class ScriptService {
  private readonly logger = new Logger(ScriptService.name);
  private refreshInterval: number;
  private nseSymbolsCache: string[] = [];
  private lastSymbolsFetch: Date | null = null;

  constructor(
    @InjectRepository(Script) private repo: Repository<Script>,
    private configService: ConfigService,
  ) {
    this.refreshInterval = this.configService.get<number>('STOCK_REFRESH_INTERVAL', 5*60*1000);
  }
  
  async onModuleInit() {
    await this.initializeSymbols();
    this.startAutoRefresh();
  }
  
  private async initializeSymbols() {
    try {
      this.nseSymbolsCache = await this.fetchNseStockSymbols();
      this.lastSymbolsFetch = new Date();
    } catch (err) {
      this.logger.error('Failed to initialize NSE symbols', err.stack);
    }
  }
  
  
  private async fetchNseStockSymbols(): Promise<string[]> {
    const url = 'https://archives.nseindia.com/content/equities/EQUITY_L.csv';
    const symbols: string[] = [];

    try {
      const response = await axios.get(url, { responseType: 'stream' });

      await new Promise<void>((resolve, reject) => {
        const stream = response.data
          .pipe(csv())
          .on('data', (row) => {
            if (row['SYMBOL']) {
              symbols.push(row['SYMBOL'].trim());
            }
          })
          .on('end', () => resolve())
          .on('error', (err) => reject(err));

        // Handle stream errors
        stream.on('error', reject);
      });

      return symbols;

      // return ["TCS", "RELIANCE", "SBIN"];
    } catch (err) {
      this.logger.error(`Failed to fetch NSE symbols: ${err.message}`);
      throw err;
    }
  }

  private async getCurrentSymbols(): Promise<string[]> {
    // Refresh symbols cache if it's empty or older than 1 day
    if (this.nseSymbolsCache.length === 0 ||
      (this.lastSymbolsFetch && (Date.now() - this.lastSymbolsFetch.getTime()) >   1000)) {
      try {
        this.nseSymbolsCache = await this.fetchNseStockSymbols();
        this.lastSymbolsFetch = new Date();
      } catch (err) {
        this.logger.warn('Failed to refresh symbols cache, using existing data');
      }
    }
    return this.nseSymbolsCache;
  }

  private async fetchStockDetails(symbol: string, type: 'BSE' | 'NSE'): Promise<StockData | null> {
    try {
      const quote = await yahooFinance.quote(`${symbol}`);
      if (!quote || !quote.regularMarketPrice) {
        this.logger.warn(`No data returned for ${symbol}`);
        return null;
      }
      // this.refreshStockData()
      return {
        name: quote.shortName || symbol,
        current_rate: quote.regularMarketPrice,
        high_value: quote.regularMarketDayHigh,
        low_value: quote.regularMarketDayLow,
        volume: quote.regularMarketVolume,
        closing_price: quote.regularMarketPreviousClose,
        create_date: new Date(),
        updated_date: new Date(),
        type,
        status: true,
        symbol,
      };
    } catch (err) {
      this.logger.warn(`Failed to fetch ${symbol}: ${err.message}`);
      return null;
    }
  }

  async fetchBseStockDetails(): Promise<StockData[]> {
    try {
      const baseSymbols = await this.getCurrentSymbols();
      const exchangeTypes = [
        { suffix: '.NS', type: 'NSE' as const },
        { suffix: '.BO', type: 'BSE' as const },
      ];

      // Process symbols in batches to avoid rate limiting
      const batchSize = 10;
      const delayBetweenBatches = 2000;
      const allData: StockData[] = [];

      for (let i = 0; i < baseSymbols.length; i += batchSize) {
        const batch = baseSymbols.slice(i, i + batchSize);
        const batchPromises = batch.flatMap((base) =>
          exchangeTypes.map(async (ex) => {
            const fullSymbol = `${base}${ex.suffix}`;
            this.logger.log(`Fetching data for symbol: ${fullSymbol}`);
            return this.fetchStockDetails(fullSymbol, ex.type);
          })
        );

        const batchResults = await Promise.all(batchPromises);
        this.logger.log(`Batch ${i / batchSize + 1} completed. Fetched ${batchResults.length} items.`);
        allData.push(...batchResults.filter((stock): stock is StockData => stock !== null));
        
        // Add delay between batches if needed
        if (i + batchSize < baseSymbols.length) {
          await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
        }
      }

      return allData;
    } catch (err) {
      this.logger.error(`Failed to fetch stock details: ${err.message}`);
      throw err;
    }
  }

  private async fetchAndSaveStockDetailsPerBatch() {
  try {
    this.logger.log('Starting stock data refresh with per-batch save...');

    const baseSymbols = await this.getCurrentSymbols();
    const exchangeTypes = [{ suffix: '.NS', type: 'NSE' as const },{ suffix: '.BO', type: 'BSE' as const },];
    const batchSize = 10;
    const delayBetweenBatches = 2000;

    for (let i = 0; i < baseSymbols.length; i += batchSize) {
      const batch = baseSymbols.slice(i, i + batchSize);
      const batchPromises = batch.flatMap((base) =>
        exchangeTypes.map(async (ex) => {
          const fullSymbol = `${base}${ex.suffix}`;
          this.logger.log(`Fetching data for: ${fullSymbol}`);
          return this.fetchStockDetails(fullSymbol, ex.type);
        })
      );

      const batchResults = await Promise.all(batchPromises);
      const cleanData = batchResults.filter((s): s is StockData => s !== null);

      // ✅ Save this batch to DB
      const saveOps = cleanData.map(async (stock) => {
        try {
          const existing = await this.repo.findOne({ where: { symbol: stock.symbol } });
          if (existing) {
            return this.repo.update({ symbol: stock.symbol }, stock as DeepPartial<Script>);
          } else {
            return this.repo.save(stock as DeepPartial<Script>);
          }
        } catch (err) {
          this.logger.error(`❌ Failed to save ${stock.symbol}: ${err.message}`);
        }
      });

      await Promise.all(saveOps);
      this.logger.log(`✅ Saved batch ${i / batchSize + 1} (${cleanData.length} items)`);

      if (i + batchSize < baseSymbols.length) {
        await new Promise((r) => setTimeout(r, delayBetweenBatches));
      }
    }

    this.logger.log('🎉 Completed batch-wise fetch and save');
  } catch (err) {
    this.logger.error(`❌ fetchAndSaveStockDetailsPerBatch failed: ${err.message}`);
  }
}
  // private async refreshStockData() {
  //   try {
  //     this.logger.log('Starting stock data refresh...');
  //     const updatedStocks = await this.fetchBseStockDetails();

  //     for (const stock of updatedStocks) {
  //       try {
  //         const existing = await this.repo.findOne({ where: { symbol: stock.symbol } });
  //         if (existing) {
  //           await this.repo.update({ symbol: stock.symbol }, stock as DeepPartial<Script>);
  //         } else {
  //           await this.repo.save(stock as DeepPartial<Script>);
  //         }
  //       } catch (err) {
  //         this.logger.error(`Failed to update ${stock.symbol}: ${err.message}`);
  //       }
  //     }

  //     this.logger.log('Stock data refresh completed successfully');
  //   } catch (err) {
  //     this.logger.error(`Stock data refresh failed: ${err.message}`);
  //   }
  // }
//   private async refreshStockData() {
//   try {
//     this.logger.log('Starting stock data refresh...');
//     const updatedStocks = await this.fetchBseStockDetails();

//     const batchSize = 10;
//     for (let i = 0; i < updatedStocks.length; i += batchSize) {
//       const batch = updatedStocks.slice(i, i + batchSize);

//       const operations = batch.map(async (stock) => {
//         try {
//           const existing = await this.repo.findOne({ where: { symbol: stock.symbol } });
//           if (existing) {
//             return this.repo.update({ symbol: stock.symbol }, stock as DeepPartial<Script>);
//           } else {
//             return this.repo.save(stock as DeepPartial<Script>);
//           }
//         } catch (err) {
//           this.logger.error(`❌ Failed to process ${stock.symbol}: ${err.message}`);
//         }
//       });

//       await Promise.all(operations); // Execute all inserts/updates in parallel for this batch
//       this.logger.log(`✅ Batch ${i / batchSize + 1} saved (${batch.length} items)`);

//       // Optional delay between batches (avoid DB overload)
//       await new Promise((r) => setTimeout(r, 300));
//     }

//     this.logger.log('🎉 Stock data refresh completed successfully');
//   } catch (err) {
//     this.logger.error(`❌ Stock data refresh failed: ${err.message}`);
//   }
// }

  

  startAutoRefresh() {
    setInterval(() => {
      this.fetchAndSaveStockDetailsPerBatch().catch(err =>
        this.logger.error('Auto-refresh error:', err)
      );
    }, this.refreshInterval);

    // Initial refresh
    this.fetchAndSaveStockDetailsPerBatch().catch(err =>
      this.logger.error('Initial refresh error:', err)
    );
  }
  async create(dto: CreateScriptDto) {
    const script = this.repo.create(dto);
    return this.repo.save(script);
  }

  async findAll(page = 1, limit = 10, search?: string) {
    const skip = (page - 1) * limit;

    const where = search ? [{ name: Like(`%${search}%`) }] : {};

    const [scripts, total] = await this.repo.findAndCount({
      where,
      skip,
      take: limit,
      order: { id: 'ASC' },
    });

    if (scripts.length === 0) {
      throw new NotFoundException('No scripts found');
    }

    return {
      data: scripts,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const script = await this.repo.findOneBy({ id });
    if (!script) throw new NotFoundException('Script not found');
    return script;
  }

  async update(id: number, dto: UpdateScriptDto) {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Script not found');
    }
    return { message: 'Script deleted successfully' };
  }
  async getStockData(symbol: string) {
   try {
    // Calculate dates - 7 days ago to today
    const today = new Date();
    const period2 = today.toISOString().split('T')[0]; // YYYY-MM-DD
    const pastDate = new Date(today);
    pastDate.setDate(today.getDate() - 7);
    const period1 = pastDate.toISOString().split('T')[0];

    // Fetch historical data
    const result = await yahooFinance.historical(symbol, {
      period1,
      period2,
      interval: '1d',
    });

    if (!result || result.length === 0) {
      throw new HttpException('No historical data found', 404);
    }

    // Map data to your desired format
    return result.map((entry) => ({
      date: entry.date.toISOString().split('T')[0], // format date YYYY-MM-DD
      close: entry.close,
      volume: entry.volume,
    }));

  } catch (error) {
    this.logger.error(`Yahoo Finance API error: ${error.message || error}`);
    throw new HttpException('Error fetching stock data from Yahoo Finance', 500);
  }
}

}
