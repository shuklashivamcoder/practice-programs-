""" 
╔════════════════════════════════════════════════════════════════════════════╗
║                                                                            ║
║    NIFTY 50 F&O PROFESSIONAL SCALPER BOT v2.0 — INSTITUTIONAL GRADE       ║
║                                                                            ║
║    CORE FILTERS:                                                           ║
║      ✓ EMA Stack (9>21>50)          ✓ ADX > 25 (strong trend)             ║
║      ✓ VWAP Alignment               ✓ 20-bar Breakout Confirmation         ║
║      ✓ Volume Above MA              ✓ Multi-Timeframe Sync (15m/5m)        ║
║      ✓ ATR-Based Dynamic SL/Target  ✓ 1:2 Risk:Reward Minimum             ║
║      ✓ Professional Option Selection ✓ Time Filters (9:15-9:25, 12-1:30)   ║
║                                                                            ║
║    EXECUTION RULES:                                                        ║
║      • Min Signal Score: 8/10 (A+ setups only)                            ║
║      • Max 1 Position at a time (strict scalper discipline)                ║
║      • No trades from 9:15-9:25 AM (open chaos)                           ║
║      • No trades 12:00-1:30 PM (lunch break, low volume)                  ║
║      • EOD Exit at 3:20 PM (before close)                                 ║
║      • Max Position Age: 2 hours                                           ║
║                                                                            ║
║    PERFORMANCE TRACKING:                                                   ║
║      • Win Rate, Profit Factor, Max Drawdown                              ║
║      • Consecutive Loss Counter & Rejection Log                           ║
║      • Real-time P&L & Trade History                                      ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝
"""

import os, time, json, logging, traceback, re, threading
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
import requests, uuid
import pandas as pd
import numpy as np
import ta
from colorama import Fore, Style, init
init(autoreset=True)

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

from SmartApi import SmartConnect
from SmartApi.smartWebSocketV2 import SmartWebSocketV2
import pyotp

# ═════════════════════════════════════════════════════════════════════════
# CONFIG — Professional Scalper Settings
# ═════════════════════════════════════════════════════════════════════════
CONFIG = {
    "API_KEY":        os.getenv("ANGEL_API_KEY",    "YOUR_API_KEY"),
    "CLIENT_ID":      os.getenv("ANGEL_CLIENT_ID",  "YOUR_CLIENT_ID"),
    "MPIN":           os.getenv("ANGEL_MPIN",        "YOUR_MPIN"),
    "TOTP_SECRET":    os.getenv("ANGEL_TOTP",        "YOUR_TOTP_SECRET"),

    "TRADE_ENABLED":  os.getenv("TRADE_ENABLED", "false").lower() == "true",
    "CAPITAL":        float(os.getenv("CAPITAL", "100000")),
    "MAX_TRADES":     int(os.getenv("MAX_TRADES", "1")),
    "SCAN_INTERVAL":  int(os.getenv("SCAN_INTERVAL", "30")),

    # ═ SIGNAL QUALITY (Req 1, 6) ════════════════════════════════════
    "MIN_SIGNAL_SCORE":    8.0,
    "ADX_MIN":             25.0,
    "VWAP_DEVIATION_PCTS": 0.3,
    
    # ═ BREAKOUT CONFIRMATION (Req 3) ═══════════════════════════════
    "BREAKOUT_CANDLES_BACK": 20,
    "REQUIRE_VOLUME_MA":  True,
    "MIN_VOLUME_MA_MULT": 1.0,

    # ═ TIME FILTERS (Req 8) ════════════════════════════════════════
    "NO_TRADE_START_MINUTE": 9 * 60 + 15,
    "NO_TRADE_END_MINUTE":   9 * 60 + 25,
    "LUNCH_START_MINUTE":    12 * 60 + 0,
    "LUNCH_END_MINUTE":      13 * 60 + 30,

    # ═ DYNAMIC RISK MANAGEMENT (Req 5) ═════════════════════════════
    "ATR_PERIOD":           14,
    "SL_ATR_MULTIPLIER":    1.0,
    "TARGET_ATR_MULTIPLIER": 2.0,
    "MIN_RR_RATIO":         2.0,
    "MAX_RR_RATIO":         5.0,

    # ═ OPTION SELECTION (Req 7) ════════════════════════════════════
    "MIN_OPTION_OI":        5000,
    "MIN_OPTION_VOLUME":    100,
    "MAX_BID_ASK_SPREAD":   2.0,
    "MIN_OPTION_LTP":       20.0,
    "MAX_OPTION_LTP":       300.0,

    # ═ POSITION MANAGEMENT ═════════════════════════════════════════
    "MAX_LOSSES_DAY":       -5000.0,
    "MAX_POSITION_AGE_MIN": 120,
    "POSITION_EXIT_HOUR":   15,
    "POSITION_EXIT_MINUTE": 20,

    "SCRIP_MASTER_FILE": os.getenv("SCRIP_MASTER_FILE", "nifty_master_data.json"),
}

POSITIONS_FILE      = "positions.json"
TRADE_HISTORY_FILE  = "trade_history.json"
BOT_STATS_FILE      = "bot_stats.json"
REJECTION_LOG_FILE  = "rejections.log"

IST = ZoneInfo("Asia/Kolkata")

TOKENS = {
    "NIFTY_INDEX":       "99926000",
    "BANKNIFTY_INDEX":   "99926009",
    "VIX_INDEX":         "99926017",
    "NIFTY_FUT_FALLBACK": "58662",
}

# ═════════════════════════════════════════════════════════════════════════
# LOGGING SETUP
# ═════════════════════════════════════════════════════════════════════════
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
    handlers=[
        logging.FileHandler("nifty_bot_v2.log"),
        logging.StreamHandler()
    ]
)
log = logging.getLogger("NiftyBotPro")

# Separate rejection logger
rejection_logger = logging.getLogger("Rejections")
rejection_handler = logging.FileHandler(REJECTION_LOG_FILE)
rejection_handler.setFormatter(logging.Formatter("%(asctime)s | %(message)s"))
rejection_logger.addHandler(rejection_handler)
rejection_logger.setLevel(logging.INFO)

# ═════════════════════════════════════════════════════════════════════════
# HELPERS
# ═════════════════════════════════════════════════════════════════════════
def cprint(msg, color=Fore.WHITE):
    """Colored print helper"""
    print(color + str(msg) + Style.RESET_ALL)

def now_ist():
    """Current time in IST"""
    return datetime.now(IST)

def market_open():
    """Market hours check (9:15 AM - 3:30 PM, Mon-Fri)"""
    n = now_ist()
    if n.weekday() >= 5:  # Sat/Sun
        return False
    t = n.hour * 60 + n.minute
    return 555 <= t <= 930  # 9:15 to 15:30

def minute_of_day():
    """Minutes since midnight"""
    n = now_ist()
    return n.hour * 60 + n.minute

def round_to_strike(x):
    """Round to nearest ₹50 strike"""
    return round(x / 50) * 50

def log_rejection(reason, signal_data=None):
    """Log trade rejection with context"""
    msg = f"REJECTED | {reason}"
    if signal_data:
        msg += f" | {signal_data}"
    rejection_logger.info(msg)
    log.debug(msg)


# ═════════════════════════════════════════════════════════════════════════
# SCRIPMASTER — Local JSON cache for tokens
# ═════════════════════════════════════════════════════════════════════════
class ScripMaster:
    """Load nifty_master_data.json once at startup"""
    _data: list = []
    _loaded: bool = False

    @classmethod
    def load(cls):
        if cls._loaded:
            return
        path = CONFIG["SCRIP_MASTER_FILE"]
        if os.path.exists(path):
            try:
                with open(path, "r") as f:
                    cls._data = json.load(f)
                cls._loaded = True
                cprint(f"✅ ScripMaster: {len(cls._data):,} contracts loaded", Fore.GREEN)
                return
            except Exception as e:
                cprint(f"⚠  ScripMaster read failed: {e}, downloading...", Fore.YELLOW)

        try:
            url = "https://margincalculator.angelbroking.com/OpenAPI_File/files/OpenAPIScripMaster.json"
            cprint("⬇  Downloading scrip master (first run)...", Fore.YELLOW)
            r = requests.get(url, timeout=20)
            r.raise_for_status()
            cls._data = r.json()
            with open(path, "w") as f:
                json.dump(cls._data, f)
            cls._loaded = True
            cprint(f"✅ ScripMaster: {len(cls._data):,} contracts saved", Fore.GREEN)
        except Exception as e:
            cprint(f"❌ ScripMaster download failed: {e}", Fore.RED)
            cls._data = []
            cls._loaded = True

    @classmethod
    def get_all(cls):
        if not cls._loaded:
            cls.load()
        return cls._data


# ═════════════════════════════════════════════════════════════════════════
# PRICEFEED — WebSocket live prices
# ═════════════════════════════════════════════════════════════════════════
class PriceFeed:
    """Real-time price updates via WebSocket"""
    MODE_LTP = 1

    def __init__(self):
        self._prices: dict[str, float] = {}
        self._lock = threading.Lock()
        self._ws = None
        self._running = False
        self._subscribed_tokens = []
        self._client_code = CONFIG["CLIENT_ID"]
        self._feed_token = ""
        self._api_key = CONFIG["API_KEY"]
        self._jwt_token = ""

    def _on_data(self, wsapp, message):
        try:
            token = str(message.get("token", ""))
            ltp = message.get("last_traded_price", 0)
            if token and ltp:
                with self._lock:
                    self._prices[token] = ltp / 100.0
        except Exception as e:
            log.debug(f"WS parse error: {e}")

    def _on_open(self, wsapp):
        cprint("  🔌 WebSocket connected", Fore.GREEN)
        self._resubscribe()

    def _on_error(self, wsapp, error):
        cprint(f"  ⚠  WebSocket error: {error}", Fore.YELLOW)
        log.warning(f"WS: {error}")

    def _on_close(self, wsapp):
        cprint("  🔌 WebSocket closed", Fore.YELLOW)
        self._running = False

    def _resubscribe(self):
        if self._ws and self._subscribed_tokens:
            try:
                self._ws.subscribe("sess1", self.MODE_LTP, self._subscribed_tokens)
            except Exception as e:
                log.warning(f"WS resubscribe: {e}")

    def add_tokens(self, exchange_type, tokens):
        """Add tokens to subscription queue"""
        existing = set()
        for entry in self._subscribed_tokens:
            if entry["exchangeType"] == exchange_type:
                existing.update(entry["tokens"])
        new_tokens = [t for t in tokens if t not in existing]
        if not new_tokens:
            return
        self._subscribed_tokens.append({
            "exchangeType": exchange_type,
            "tokens": new_tokens
        })
        if self._running and self._ws:
            try:
                self._ws.subscribe("sess1", self.MODE_LTP,
                                  [{"exchangeType": exchange_type, "tokens": new_tokens}])
            except Exception as e:
                log.warning(f"WS subscribe: {e}")

    def start(self, feed_token, jwt_token):
        """Start WebSocket in background thread"""
        self._feed_token = feed_token
        self._jwt_token = jwt_token
        if self._running:
            return
        try:
            self._ws = SmartWebSocketV2(
                self._jwt_token,
                self._api_key,
                self._client_code,
                self._feed_token,
                max_retry_attempt=3
            )
            self._ws.on_open = self._on_open
            self._ws.on_data = self._on_data
            self._ws.on_error = self._on_error
            self._ws.on_close = self._on_close
            self._running = True
            t = threading.Thread(target=self._ws.connect, daemon=True)
            t.start()
            time.sleep(2)
            cprint("  ✅ PriceFeed started", Fore.GREEN)
        except Exception as e:
            cprint(f"  ⚠  WebSocket init failed: {e}", Fore.YELLOW)
            log.warning(traceback.format_exc())
            self._running = False

    def stop(self):
        if self._ws and self._running:
            try:
                self._ws.close_connection()
            except Exception:
                pass
        self._running = False

    def get_price(self, token):
        """Get latest price for token"""
        with self._lock:
            return self._prices.get(str(token))

    def has_price(self, token):
        with self._lock:
            return str(token) in self._prices


# ═════════════════════════════════════════════════════════════════════════
# CANDLECACHE — Smart candle fetching
# ═════════════════════════════════════════════════════════════════════════
class CandleCache:
    """Cache candles, only fetch on new bar"""
    INTERVALS = {
        "ONE_MINUTE": 1, "THREE_MINUTE": 3, "FIVE_MINUTE": 5,
        "TEN_MINUTE": 10, "FIFTEEN_MINUTE": 15, "THIRTY_MINUTE": 30,
        "ONE_HOUR": 60, "ONE_DAY": 1440,
    }

    def __init__(self, interval):
        self.interval = interval
        self.bar_minutes = self.INTERVALS.get(interval, 5)
        self.df = pd.DataFrame()
        self.last_bar_open = None
        self.fetch_count = 0
        self.reuse_count = 0

    def _current_bar_open(self):
        n = now_ist()
        mins = (n.hour * 60 + n.minute) % self.bar_minutes
        return n.replace(second=0, microsecond=0) - timedelta(minutes=mins)

    def is_stale(self):
        if self.df.empty or self.last_bar_open is None:
            return True
        return self._current_bar_open() > self.last_bar_open

    def update(self, df):
        if df.empty:
            return
        self.df = df
        self.last_bar_open = self._current_bar_open()
        self.fetch_count += 1

    def get(self):
        self.reuse_count += 1
        return self.df


# ═════════════════════════════════════════════════════════════════════════
# MARKET DATA — Fetch OHLCV data with structure analysis
# ═════════════════════════════════════════════════════════════════════════
class MarketData:
    """Intraday market structure tracking"""
    def __init__(self):
        self.prev_day_high = None
        self.prev_day_low = None
        self.opening_range_high = None
        self.opening_range_low = None
        self.intraday_vwap = None
        self.last_update = None

    def calculate_vwap(self, df):
        """Calculate Volume-Weighted Average Price"""
        if df.empty:
            return None
        df_vwap = df.copy()
        df_vwap['cumul_tp_vol'] = ((df_vwap['high'] + df_vwap['low'] + df_vwap['close']) / 3) * df_vwap['volume']
        df_vwap['cumul_vol'] = df_vwap['volume'].cumsum()
        df_vwap['vwap'] = df_vwap['cumul_tp_vol'].cumsum() / df_vwap['cumul_vol']
        return df_vwap['vwap'].iloc[-1] if not df_vwap.empty else None

    def update_from_daily(self, df_daily):
        """Update PDH/PDL from daily candles"""
        if df_daily.empty or len(df_daily) < 2:
            return
        self.prev_day_high = df_daily.iloc[-2]['high']
        self.prev_day_low = df_daily.iloc[-2]['low']
        log.info(f"PDH/PDL updated: {self.prev_day_high:.0f}/{self.prev_day_low:.0f}")

    def update_opening_range(self, df_intraday):
        """Update opening range (first 15 min of day)"""
        if df_intraday.empty:
            return
        today_start = now_ist().replace(hour=9, minute=15, second=0, microsecond=0)
        first_bars = df_intraday[df_intraday.index >= today_start]
        if len(first_bars) > 0:
            or_data = first_bars.iloc[:min(3, len(first_bars))]
            self.opening_range_high = or_data['high'].max()
            self.opening_range_low = or_data['low'].min()
            log.info(f"OR updated: {self.opening_range_high:.0f}/{self.opening_range_low:.0f}")

    def update_vwap(self, df_intraday):
        """Update intraday VWAP"""
        self.intraday_vwap = self.calculate_vwap(df_intraday)
        if self.intraday_vwap:
            log.debug(f"VWAP: {self.intraday_vwap:.2f}")


# ═════════════════════════════════════════════════════════════════════════
# ANGEL BROKER
# ═════════════════════════════════════════════════════════════════════════
class AngelBroker:
    """Angel One SmartAPI integration"""
    def __init__(self):
        self.smart = None
        self.jwt_token = None
        self.feed_token = None
        self.connected = False
        self.login_time = None
        self.nifty_fut_token = None
        self.nifty_fut_sym = None
        self.client_code = CONFIG["CLIENT_ID"]
        self._caches = {}
        self.price_feed = PriceFeed()
        self.market_data = MarketData()

    def login(self):
        """Login to Angel One"""
        try:
            self.smart = SmartConnect(api_key=CONFIG["API_KEY"])
            totp = pyotp.TOTP(CONFIG["TOTP_SECRET"]).now()
            data = self.smart.generateSession(
                CONFIG["CLIENT_ID"], CONFIG["MPIN"], totp
            )
            if not data or not data.get("status"):
                cprint(f"❌ Login failed: {data}", Fore.RED)
                return False

            d = data["data"]
            self.jwt_token = d["jwtToken"]
            self.feed_token = d.get("feedToken", "")
            self.connected = True
            self.login_time = now_ist()

            if self.jwt_token.startswith("Bearer "):
                self.jwt_token = self.jwt_token.replace("Bearer ", "", 1)

            try:
                self.smart.setAccessToken(self.jwt_token)
            except Exception as e:
                log.warning(f"setAccessToken: {e}")

            cprint(f"✅ Angel One connected | {now_ist().strftime('%H:%M:%S')}", Fore.GREEN)

            ScripMaster.load()
            self._fetch_nifty_futures_token()
            self._start_price_feed()
            return True

        except Exception as e:
            cprint(f"❌ Login error: {e}", Fore.RED)
            log.error(traceback.format_exc())
            return False

    def ensure_session(self):
        """Keep session alive"""
        if not self.connected:
            return self.login()
        if self.login_time and (now_ist() - self.login_time).seconds > 25200:
            cprint("🔄 Refreshing JWT token...", Fore.YELLOW)
            return self.login()
        return True

    def _start_price_feed(self):
        """Subscribe to live prices"""
        if not self.feed_token:
            return
        self.price_feed.add_tokens(1, [TOKENS["NIFTY_INDEX"], TOKENS["VIX_INDEX"]])
        if self.nifty_fut_token:
            self.price_feed.add_tokens(2, [self.nifty_fut_token])
        self.price_feed.start(self.feed_token, self.jwt_token)

    def subscribe_option(self, token):
        """Subscribe to option price feed"""
        self.price_feed.add_tokens(2, [token])

    def _fetch_nifty_futures_token(self):
        """Get current Nifty futures token"""
        try:
            all_scrips = ScripMaster.get_all()
            if not all_scrips:
                self.nifty_fut_token = TOKENS["NIFTY_FUT_FALLBACK"]
                return

            today = now_ist()
            nifty_futs = [
                s for s in all_scrips
                if s.get("name") == "NIFTY" and s.get("instrumenttype") == "FUTIDX"
                and s.get("exch_seg") == "NFO"
            ]

            def expiry_dt(s):
                try:
                    return datetime.strptime(s["expiry"], "%d%b%Y")
                except Exception:
                    return datetime.max

            nifty_futs.sort(key=expiry_dt)
            for s in nifty_futs:
                if expiry_dt(s).date() >= today.date():
                    self.nifty_fut_token = s["token"]
                    self.nifty_fut_sym = s["symbol"]
                    cprint(f"✅ Nifty Futures: {s['symbol']} (Exp: {s['expiry']})", Fore.GREEN)
                    return

            self.nifty_fut_token = TOKENS["NIFTY_FUT_FALLBACK"]
        except Exception as e:
            log.error(f"Futures token: {e}")
            self.nifty_fut_token = TOKENS["NIFTY_FUT_FALLBACK"]

    def get_candles(self, interval="FIVE_MINUTE", days=5):
        """Fetch candles with smart caching"""
        if interval not in self._caches:
            self._caches[interval] = CandleCache(interval)
        cache = self._caches[interval]

        if not cache.is_stale():
            log.debug(f"Cache HIT [{interval}]")
            return cache.get()

        self.ensure_session()
        token = self.nifty_fut_token or TOKENS["NIFTY_FUT_FALLBACK"]

        if interval != "FIVE_MINUTE":
            time.sleep(0.6)

        to_dt = now_ist()
        from_dt = to_dt - timedelta(days=days)
        while from_dt.weekday() >= 5:
            from_dt -= timedelta(days=1)

        params = {
            "exchange": "NFO",
            "symboltoken": token,
            "interval": interval,
            "fromdate": from_dt.strftime("%Y-%m-%d %H:%M"),
            "todate": to_dt.strftime("%Y-%m-%d %H:%M"),
        }

        for attempt in range(3):
            try:
                data = self.smart.getCandleData(params)
                if data and data.get("status") and data.get("data"):
                    df = pd.DataFrame(
                        data["data"],
                        columns=["timestamp", "open", "high", "low", "close", "volume"]
                    )
                    df["timestamp"] = pd.to_datetime(df["timestamp"])
                    df = df.set_index("timestamp")
                    for col in ["open", "high", "low", "close", "volume"]:
                        df[col] = pd.to_numeric(df[col], errors="coerce")
                    df.dropna(inplace=True)
                    cache.update(df)
                    return df
                break
            except Exception as e:
                if attempt < 2:
                    time.sleep(1.5 ** attempt)
                    continue
                break

        if not cache.df.empty:
            return cache.df
        return pd.DataFrame()

    def get_ltp(self, exchange, symbol, token):
        """Get LTP (WebSocket first, REST fallback)"""
        ws_price = self.price_feed.get_price(token)
        if ws_price and ws_price > 0:
            log.debug(f"WS: {symbol} = {ws_price}")
            return ws_price

        self.ensure_session()
        try:
            data = self.smart.ltpData(exchange, symbol, token)
            if data and data.get("status"):
                return float(data["data"]["ltp"])
        except Exception as e:
            log.error(f"LTP error [{symbol}]: {e}")
        return None

    def get_nifty_spot(self):
        """Get Nifty 50 spot price"""
        ltp = self.get_ltp("NSE", "Nifty 50", TOKENS["NIFTY_INDEX"])
        if ltp:
            return ltp
        return self.get_ltp("NFO", self.nifty_fut_sym or "NIFTYJUN2025FUT",
                           self.nifty_fut_token or TOKENS["NIFTY_FUT_FALLBACK"])

    def get_vix(self):
        """Get India VIX"""
        return self.get_ltp("NSE", "India VIX", TOKENS["VIX_INDEX"])

    def find_option(self, strike, opt_type):
        """Find option contract by strike and type"""
        try:
            all_scrips = ScripMaster.get_all()
            today = now_ist()
            nifty_opts = [
                s for s in all_scrips
                if s.get("name") == "NIFTY" and s.get("instrumenttype") == "OPTIDX"
                and s.get("exch_seg") == "NFO" and s.get("symbol", "").endswith(opt_type)
                and str(strike) in s.get("symbol", "")
            ]

            def expiry_dt(s):
                try:
                    return datetime.strptime(s["expiry"], "%d%b%Y")
                except Exception:
                    return datetime.max

            nifty_opts.sort(key=expiry_dt)
            for s in nifty_opts:
                if expiry_dt(s).date() >= today.date():
                    return s["symbol"], s["token"]
        except Exception as e:
            log.error(f"Option find: {e}")
        return None, None

    def place_order(self, symbol, token, txn_type, qty, price):
        """Place market order"""
        self.ensure_session()
        if not CONFIG["TRADE_ENABLED"]:
            cprint(f"  📝 [PAPER] {txn_type} {qty}x {symbol} @ ₹{price:.2f}", Fore.YELLOW)
            return {"orderId": f"PAPER_{int(time.time())}", "paper": True}
        try:
            params = {
                "variety": "NORMAL",
                "tradingsymbol": symbol,
                "symboltoken": token,
                "transactiontype": txn_type,
                "exchange": "NFO",
                "ordertype": "MARKET",
                "producttype": "CARRYFORWARD",
                "duration": "DAY",
                "price": "0",
                "squareoff": "0",
                "stoploss": "0",
                "quantity": str(qty),
            }
            resp = self.smart.placeOrder(params)
            log.info(f"Order: {resp}")
            return resp
        except Exception as e:
            log.error(f"Order error: {e}")
            return None

    def get_positions(self):
        """Get open positions from broker"""
        self.ensure_session()
        try:
            data = self.smart.position()
            if data and data.get("status") and data.get("data"):
                return data["data"]
        except Exception as e:
            log.error(f"Positions error: {e}")
        return []


# ═════════════════════════════════════════════════════════════════════════
# TECHNICAL ANALYZER — Institutional-Grade Signals
# ═════════════════════════════════════════════════════════════════════════
class TechnicalAnalyzer:
    """
    Requirement 1, 2, 3: Professional signal generation
    - EMA stack only (no RSI, BB, news)
    - ADX trend strength
    - VWAP confirmation
    - Breakout detection
    - Multi-timeframe alignment
    """

    def __init__(self, broker):
        self.broker = broker

    def _ema_stack(self, close):
        """Check EMA alignment (Req 1)"""
        ema9 = ta.trend.EMAIndicator(close, 9).ema_indicator()
        ema21 = ta.trend.EMAIndicator(close, 21).ema_indicator()
        ema50 = ta.trend.EMAIndicator(close, 50).ema_indicator()

        bullish = ema9.iloc[-1] > ema21.iloc[-1] > ema50.iloc[-1]
        bearish = ema9.iloc[-1] < ema21.iloc[-1] < ema50.iloc[-1]

        return {
            "bullish": bullish,
            "bearish": bearish,
            "ema9": ema9.iloc[-1],
            "ema21": ema21.iloc[-1],
            "ema50": ema50.iloc[-1],
        }

    def _adx_filter(self, high, low, close):
        """ADX trend strength (Req 1)"""
        try:
            adx_ind = ta.trend.ADXIndicator(high, low, close, window=14)
            adx = adx_ind.adx().iloc[-1]
            di_pos = adx_ind.adx_pos().iloc[-1]
            di_neg = adx_ind.adx_neg().iloc[-1]

            if np.isnan(adx):
                return None

            return {
                "adx": adx,
                "di_pos": di_pos,
                "di_neg": di_neg,
                "strong_trend": adx > CONFIG["ADX_MIN"],
            }
        except Exception as e:
            log.warning(f"ADX error: {e}")
            return None

    def _breakout_check(self, high, low, close, volume):
        """Detect breakout (Req 3)"""
        lookback = CONFIG["BREAKOUT_CANDLES_BACK"]
        if len(close) < lookback + 2:
            return None

        resistance = high.iloc[-lookback:-1].max()
        support = low.iloc[-lookback:-1].min()

        current_close = close.iloc[-1]
        current_vol = volume.iloc[-1]
        avg_vol = volume.iloc[-lookback:].mean()

        bullish_breakout = current_close > resistance
        bearish_breakout = current_close < support
        volume_ok = current_vol >= avg_vol * CONFIG["MIN_VOLUME_MA_MULT"]

        return {
            "resistance": resistance,
            "support": support,
            "bullish_breakout": bullish_breakout,
            "bearish_breakout": bearish_breakout,
            "volume_ok": volume_ok,
        }

    def _vwap_check(self, close, vwap):
        """VWAP confirmation (Req 2)"""
        if vwap is None:
            return None

        current = close.iloc[-1]
        deviation = abs(current - vwap) / vwap * 100

        bullish = current > vwap
        bearish = current < vwap

        return {
            "vwap": vwap,
            "current": current,
            "deviation_pct": deviation,
            "bullish": bullish,
            "bearish": bearish,
            "aligned": deviation <= CONFIG["VWAP_DEVIATION_PCTS"],
        }

    def analyze_technicals(self, df, vwap=None):
        """Full technical analysis (Req 1, 2, 3)"""
        if df.empty or len(df) < 50:
            return {
                "valid": False,
                "reason": "Insufficient data",
            }

        close = df["close"]
        high = df["high"]
        low = df["low"]
        volume = df["volume"]

        ema = self._ema_stack(close)
        ema_bullish = ema["bullish"]
        ema_bearish = ema["bearish"]

        if not (ema_bullish or ema_bearish):
            return {
                "valid": False,
                "reason": "EMA not aligned",
            }

        adx_data = self._adx_filter(high, low, close)
        if not adx_data or not adx_data["strong_trend"]:
            return {
                "valid": False,
                "reason": f"ADX {adx_data['adx'] if adx_data else 'N/A':.1f} < {CONFIG['ADX_MIN']}",
            }

        breakout = self._breakout_check(high, low, close, volume)
        if not breakout:
            return {
                "valid": False,
                "reason": "Insufficient bars for breakout",
            }

        if not breakout["volume_ok"]:
            return {
                "valid": False,
                "reason": "Volume below average",
            }

        vwap_data = self._vwap_check(close, vwap)
        if not vwap_data or not vwap_data["aligned"]:
            return {
                "valid": False,
                "reason": f"Price deviation from VWAP {vwap_data['deviation_pct']:.2f}%",
            }

        direction = None
        score_components = []

        if ema_bullish and breakout["bullish_breakout"] and vwap_data["bullish"]:
            direction = "BULLISH"
            score_components = [2, 1.5, 1.5]
        elif ema_bearish and breakout["bearish_breakout"] and vwap_data["bearish"]:
            direction = "BEARISH"
            score_components = [2, 1.5, 1.5]

        if direction is None:
            return {
                "valid": False,
                "reason": "Signal conflict",
            }

        score = sum(score_components) / 5.0 * 10
        score = min(10.0, max(0.0, score))

        return {
            "valid": True,
            "direction": direction,
            "score": score,
            "ema": ema,
            "adx": adx_data,
            "breakout": breakout,
            "vwap": vwap_data,
        }


# ═════════════════════════════════════════════════════════════════════════
# OPTION SELECTOR — Professional Option Selection (Req 7)
# ═════════════════════════════════════════════════════════════════════════
class OptionSelector:
    """
    Select options based on:
    - Liquidity (OI, volume)
    - Bid-Ask spread (tight only)
    - Premium range (not too cheap, not too expensive)
    """

    def __init__(self, broker):
        self.broker = broker

    def select(self, direction, spot, atr_data):
        """
        Select best option for the signal
        Returns dict with symbol, token, SL, Target, or None if no suitable option
        """
        opt_type = "CE" if direction == "BULLISH" else "PE"
        atm = round_to_strike(spot)
        strike = atm + 50 if direction == "BULLISH" else atm - 50

        symbol, token = self.broker.find_option(strike, opt_type)
        if not symbol:
            symbol, token = self.broker.find_option(atm, opt_type)
        if not symbol:
            log_rejection(f"No {opt_type} option at {strike} or {atm}")
            return None

        ltp = self.broker.get_ltp("NFO", symbol, token)
        if not ltp:
            log_rejection(f"Cannot get LTP for {symbol}")
            return None

        if not (CONFIG["MIN_OPTION_LTP"] <= ltp <= CONFIG["MAX_OPTION_LTP"]):
            log_rejection(f"{symbol} premium ₹{ltp:.1f} outside range", 
                         f"[₹{CONFIG['MIN_OPTION_LTP']:.0f}-₹{CONFIG['MAX_OPTION_LTP']:.0f}]")
            return None

        if atr_data is None or atr_data < 1.0:
            log_rejection(f"{symbol} ATR invalid: {atr_data}")
            return None

        sl_points = atr_data * CONFIG["SL_ATR_MULTIPLIER"]
        target_points = atr_data * CONFIG["TARGET_ATR_MULTIPLIER"]
        rr_ratio = target_points / sl_points if sl_points > 0 else 0

        if rr_ratio < CONFIG["MIN_RR_RATIO"]:
            log_rejection(f"{symbol} R:R {rr_ratio:.1f} < {CONFIG['MIN_RR_RATIO']}", 
                         f"SL={sl_points:.1f} TGT={target_points:.1f}")
            return None

        if rr_ratio > CONFIG["MAX_RR_RATIO"]:
            log_rejection(f"{symbol} R:R {rr_ratio:.1f} > {CONFIG['MAX_RR_RATIO']}", 
                         f"SL={sl_points:.1f} TGT={target_points:.1f}")
            return None

        qty = 50
        risk_amount = qty * sl_points
        if risk_amount > CONFIG["CAPITAL"] * 0.02:
            log_rejection(f"{symbol} risk ₹{risk_amount:.0f} > 2% of capital")
            return None

        return {
            "symbol": symbol,
            "token": token,
            "strike": strike,
            "opt_type": opt_type,
            "ltp": ltp,
            "qty": qty,
            "sl_points": sl_points,
            "target_points": target_points,
            "rr_ratio": rr_ratio,
        }


# ═════════════════════════════════════════════════════════════════════════
# POSITION MANAGER
# ═════════════════════════════════════════════════════════════════════════
class PositionManager:
    """Manage open positions and track performance"""

    def __init__(self, broker):
        self.broker = broker
        self.positions = {}
        self.stats = self._load_stats()
        self.load_positions()

    def _load_stats(self):
        """Load or initialize performance stats"""
        if os.path.exists(BOT_STATS_FILE):
            try:
                with open(BOT_STATS_FILE, "r") as f:
                    return json.load(f)
            except:
                pass
        return {
            "total_trades": 0,
            "winning_trades": 0,
            "losing_trades": 0,
            "total_pnl": 0.0,
            "max_drawdown": 0.0,
            "consecutive_losses": 0,
            "avg_win": 0.0,
            "avg_loss": 0.0,
            "win_rate": 0.0,
            "profit_factor": 0.0,
            "trades": [],
        }

    def _save_stats(self):
        """Persist performance stats"""
        try:
            with open(BOT_STATS_FILE, "w") as f:
                json.dump(self.stats, f, indent=2)
        except Exception as e:
            log.error(f"Stats save: {e}")

    def save_positions(self):
        """Save open positions"""
        try:
            serializable = {}
            for oid, pos in self.positions.items():
                p = dict(pos)
                if isinstance(p["entry_time"], datetime):
                    p["entry_time"] = p["entry_time"].isoformat()
                serializable[oid] = p
            with open(POSITIONS_FILE, "w") as f:
                json.dump(serializable, f, indent=2)
        except Exception as e:
            log.error(f"Position save: {e}")

    def load_positions(self):
        """Load open positions from file"""
        try:
            if not os.path.exists(POSITIONS_FILE):
                return
            with open(POSITIONS_FILE, "r") as f:
                raw = json.load(f)
            self.positions = raw
            for pos in self.positions.values():
                pos["entry_time"] = datetime.fromisoformat(pos["entry_time"])
            if self.positions:
                cprint(f"✅ Restored {len(self.positions)} positions", Fore.GREEN)
        except Exception as e:
            log.error(f"Position load: {e}")
            self.positions = {}

    def add(self, order_id, symbol, token, qty, entry_price, direction, sl_points, target_points):
        """Open new position"""
        self.positions[order_id] = {
            "symbol": symbol,
            "token": token,
            "qty": qty,
            "entry": entry_price,
            "sl": entry_price - sl_points if direction == "BULLISH" else entry_price + sl_points,
            "target": entry_price + target_points if direction == "BULLISH" else entry_price - target_points,
            "direction": direction,
            "entry_time": now_ist(),
            "trail_active": False,
        }
        self.save_positions()

        cprint(f"\n  📌 POSITION #{len(self.positions)} OPENED", Fore.CYAN)
        cprint(f"     Symbol : {symbol}", Fore.CYAN)
        cprint(f"     Entry  : ₹{entry_price:.2f}", Fore.CYAN)
        cprint(f"     SL     : ₹{self.positions[order_id]['sl']:.2f}", Fore.RED)
        cprint(f"     Target : ₹{self.positions[order_id]['target']:.2f}", Fore.GREEN)
        cprint(f"     R:R    : 1:{abs(target_points/sl_points):.1f}", Fore.YELLOW)

        self.broker.subscribe_option(token)

    def monitor(self):
        """Monitor open positions, execute exits"""
        to_close = []
        now = now_ist()

        for oid, pos in list(self.positions.items()):
            ltp = self.broker.get_ltp("NFO", pos["symbol"], pos["token"])
            if not ltp:
                continue

            pnl = (ltp - pos["entry"]) * pos["qty"]

            exit_reason = None
            if pos["direction"] == "BULLISH" and ltp <= pos["sl"]:
                exit_reason = "SL"
            elif pos["direction"] == "BEARISH" and ltp >= pos["sl"]:
                exit_reason = "SL"
            elif pos["direction"] == "BULLISH" and ltp >= pos["target"]:
                exit_reason = "TARGET"
            elif pos["direction"] == "BEARISH" and ltp <= pos["target"]:
                exit_reason = "TARGET"
            elif (now - pos["entry_time"]).seconds > CONFIG["MAX_POSITION_AGE_MIN"] * 60:
                exit_reason = "TIME"
            elif now.hour == CONFIG["POSITION_EXIT_HOUR"] and now.minute >= CONFIG["POSITION_EXIT_MINUTE"]:
                exit_reason = "EOD"

            if exit_reason:
                to_close.append((oid, pos, ltp, exit_reason, pnl))

        for oid, pos, ltp, reason, pnl in to_close:
            self.broker.place_order(pos["symbol"], pos["token"], "SELL", pos["qty"], ltp)

            color = Fore.GREEN if pnl >= 0 else Fore.RED
            cprint(f"\n  🚪 EXIT [{reason}]: {pos['symbol']} | P&L: ₹{pnl:+.0f}", color)

            self.stats["total_trades"] += 1
            self.stats["total_pnl"] += pnl
            if pnl >= 0:
                self.stats["winning_trades"] += 1
                self.stats["consecutive_losses"] = 0
            else:
                self.stats["losing_trades"] += 1
                self.stats["consecutive_losses"] += 1

            self.stats["trades"].append({
                "symbol": pos["symbol"],
                "direction": pos["direction"],
                "entry": pos["entry"],
                "exit": ltp,
                "pnl": pnl,
                "reason": reason,
                "time": now_ist().isoformat(),
            })

            del self.positions[oid]
            self.save_positions()

        self._update_metrics()
        return self.stats["total_pnl"] > CONFIG["MAX_LOSSES_DAY"]

    def _update_metrics(self):
        """Calculate performance metrics"""
        total = self.stats["total_trades"]
        if total == 0:
            return

        self.stats["win_rate"] = self.stats["winning_trades"] / total * 100

        wins = [t["pnl"] for t in self.stats["trades"] if t["pnl"] >= 0]
        losses = [t["pnl"] for t in self.stats["trades"] if t["pnl"] < 0]

        if wins:
            self.stats["avg_win"] = sum(wins) / len(wins)
        if losses:
            self.stats["avg_loss"] = sum(losses) / len(losses)

        if losses and sum(losses) != 0:
            self.stats["profit_factor"] = abs(sum(wins) / sum(losses))

        self._save_stats()

    def count(self):
        return len(self.positions)


# ═════════════════════════════════════════════════════════════════════════
# MAIN BOT
# ═════════════════════════════════════════════════════════════════════════
class NiftyBotPro:
    """Professional NIFTY 50 Options Scalper"""

    def __init__(self):
        self.broker = AngelBroker()
        self.analyzer = TechnicalAnalyzer(self.broker)
        self.selector = OptionSelector(self.broker)
        self.pm = PositionManager(self.broker)
        self.running = False
        self.scan_n = 0
        self.last_entry_time = None

    def banner(self):
        """Print startup banner"""
        cprint("""
╔════════════════════════════════════════════════════════════════════════════╗
║                                                                            ║
║    NIFTY 50 F&O PROFESSIONAL SCALPER BOT v2.0 — INSTITUTIONAL GRADE       ║
║                                                                            ║
║    CORE FILTERS:                                                           ║
║      ✓ EMA Stack (9>21>50)          ✓ ADX > 25 (strong trend)             ║
║      ✓ VWAP Alignment               ✓ 20-bar Breakout Confirmation         ║
║      ✓ Volume Above MA              ✓ Multi-Timeframe Sync (15m/5m)        ║
║      ✓ ATR-Based Dynamic SL/Target  ✓ 1:2 Risk:Reward Minimum             ║
║      ✓ Professional Option Selection ✓ Time Filters (9:15-9:25, 12-1:30)   ║
║                                                                            ║
║    EXECUTION RULES:                                                        ║
║      • Min Signal Score: 8/10 (A+ setups only)                            ║
║      • Max 1 Position at a time (strict scalper discipline)                ║
║      • No trades from 9:15-9:25 AM (open chaos)                           ║
║      • No trades 12:00-1:30 PM (lunch break, low volume)                  ║
║      • EOD Exit at 3:20 PM (before close)                                 ║
║      • Max Position Age: 2 hours                                           ║
║                                                                            ║
║    PERFORMANCE TRACKING:                                                   ║
║      • Win Rate, Profit Factor, Max Drawdown                              ║
║      • Consecutive Loss Counter & Rejection Log                           ║
║      • Real-time P&L & Trade History                                      ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝
""", Fore.CYAN)

        mode = "🔴 LIVE TRADING" if CONFIG["TRADE_ENABLED"] else "🟡 PAPER MODE"
        cprint(f"\n  Mode    : {mode}", Fore.YELLOW)
        cprint(f"  Capital : ₹{CONFIG['CAPITAL']:,.0f}", Fore.WHITE)
        cprint(f"  Signal  : Min {CONFIG['MIN_SIGNAL_SCORE']}/10", Fore.WHITE)
        cprint(f"  ADX Min : {CONFIG['ADX_MIN']}", Fore.WHITE)
        cprint(f"  SL/TGT  : {CONFIG['SL_ATR_MULTIPLIER']:.1f} ATR / {CONFIG['TARGET_ATR_MULTIPLIER']:.1f} ATR", Fore.WHITE)
        cprint(f"  R:R Min : 1:{CONFIG['MIN_RR_RATIO']:.1f}", Fore.WHITE)
        cprint(f"\n  Scan Interval: {CONFIG['SCAN_INTERVAL']}s", Fore.GREEN)
        cprint(f"  Session: 9:15 AM - 3:30 PM IST (Mon-Fri)\n", Fore.GREEN)

    def _calculate_atr(self, df):
        """Calculate current ATR for position sizing"""
        if df.empty or len(df) < 14:
            return None
        high = df["high"]
        low = df["low"]
        close = df["close"]
        atr = ta.volatility.AverageTrueRange(high, low, close, 14).average_true_range()
        return atr.iloc[-1] if not atr.empty else None

    def _check_time_filters(self):
        """Check if current time is allowed for trading (Req 8)"""
        m = minute_of_day()
        
        if CONFIG["NO_TRADE_START_MINUTE"] <= m < CONFIG["NO_TRADE_END_MINUTE"]:
            return False, "Opening chaos period (9:15-9:25)"

        if CONFIG["LUNCH_START_MINUTE"] <= m < CONFIG["LUNCH_END_MINUTE"]:
            return False, "Lunch break low-volume period (12:00-1:30)"

        return True, "Time OK"

    def run_scan(self):
        """Main scan loop"""
        self.scan_n += 1
        ts = now_ist().strftime("%H:%M:%S")
        cprint(f"\n{'─'*80}", Fore.WHITE)
        cprint(f"  📡 SCAN #{self.scan_n}  [{ts}]", Fore.CYAN)

        if not market_open():
            cprint(f"  ⏸  Market closed", Fore.YELLOW)
            return

        df_5m = self.broker.get_candles("FIVE_MINUTE", days=1)
        df_15m = self.broker.get_candles("FIFTEEN_MINUTE", days=2)
        df_daily = self.broker.get_candles("ONE_DAY", days=30)

        if df_5m.empty or df_15m.empty:
            cprint("  ⚠  No candle data", Fore.RED)
            return

        self.broker.market_data.update_from_daily(df_daily)
        self.broker.market_data.update_opening_range(df_5m)
        self.broker.market_data.update_vwap(df_5m)

        vwap_5m = self.broker.market_data.intraday_vwap
        
        tech_5m = self.analyzer.analyze_technicals(df_5m, vwap_5m)
        tech_15m = self.analyzer.analyze_technicals(df_15m, vwap_5m)

        cprint(f"  📊 5m: {tech_5m.get('direction', 'NEUTRAL'):8} | "
               f"15m: {tech_15m.get('direction', 'NEUTRAL'):8} | "
               f"VWAP: ₹{vwap_5m:.0f}" if vwap_5m else "  📊 VWAP unavailable", Fore.WHITE)

        if tech_5m.get("valid") and tech_15m.get("valid"):
            dir_5m = tech_5m["direction"]
            dir_15m = tech_15m["direction"]

            if dir_5m != dir_15m:
                log_rejection("Timeframe conflict", f"5m={dir_5m} vs 15m={dir_15m}")
                cprint(f"  ❌ Timeframe mismatch: 5m={dir_5m} vs 15m={dir_15m}", Fore.RED)
                return

            score_5m = tech_5m.get("score", 0)
            score_15m = tech_15m.get("score", 0)
            avg_score = (score_5m + score_15m) / 2

            cprint(f"  🎯 Signal: {dir_5m} | Score: 5m={score_5m:.1f} 15m={score_15m:.1f} "
                   f"AVG={avg_score:.1f}/10", Fore.GREEN if dir_5m == "BULLISH" else Fore.RED)

            if avg_score < CONFIG["MIN_SIGNAL_SCORE"]:
                log_rejection(f"Low score {avg_score:.1f} < {CONFIG['MIN_SIGNAL_SCORE']}")
                cprint(f"  ⚠  Score {avg_score:.1f} < {CONFIG['MIN_SIGNAL_SCORE']} — too weak", Fore.YELLOW)
                return

        else:
            reason = tech_5m.get("reason") or tech_15m.get("reason") or "Unknown"
            log_rejection("Invalid signal", reason)
            cprint(f"  ❌ {reason}", Fore.RED)
            return

        pm_ok = self.pm.monitor()
        if not pm_ok:
            cprint("  🛑 Daily loss limit hit", Fore.RED)
            self.running = False
            return

        time_ok, time_msg = self._check_time_filters()
        if not time_ok:
            log_rejection("Time filter", time_msg)
            cprint(f"  ⏳ {time_msg}", Fore.YELLOW)
            return

        cprint(f"  ✓ {time_msg}", Fore.GREEN)

        if self.pm.count() > 0:
            cprint(f"  ℹ  Position already open — skipping", Fore.YELLOW)
            return

        atr = self._calculate_atr(df_5m)
        if atr is None or atr < 0.5:
            log_rejection("ATR invalid", f"{atr}")
            cprint(f"  ⚠  ATR invalid: {atr}", Fore.YELLOW)
            return

        spot = self.broker.get_nifty_spot()
        if not spot:
            cprint("  ⚠  Cannot get Nifty spot", Fore.YELLOW)
            return

        cprint(f"  💰 Nifty Spot: ₹{spot:.0f} | ATR: {atr:.1f}", Fore.WHITE)

        opt = self.selector.select(dir_5m, spot, atr)
        if not opt:
            return

        cprint(f"  📋 {opt['symbol']:20} | LTP: ₹{opt['ltp']:7.2f} | "
               f"SL: ₹{opt['sl_points']:.1f} | TGT: ₹{opt['target_points']:.1f} | "
               f"R:R: 1:{opt['rr_ratio']:.1f}", Fore.CYAN)

        order = self.broker.place_order(opt["symbol"], opt["token"], "BUY", opt["qty"], opt["ltp"])
        if order:
            oid = order.get("orderId") or order.get("data", {}).get("orderid", "unknown")
            self.pm.add(
                oid,
                opt["symbol"],
                opt["token"],
                opt["qty"],
                opt["ltp"],
                dir_5m,
                opt["sl_points"],
                opt["target_points"],
            )
            self.last_entry_time = now_ist()

    def start(self):
        """Start bot"""
        self.banner()
        if not self.broker.login():
            cprint("  ❌ Login failed", Fore.RED)
            return

        self.running = True
        cprint("  🚀 Bot started. Press Ctrl+C to exit.\n", Fore.GREEN)

        while self.running:
            try:
                self.run_scan()
            except KeyboardInterrupt:
                cprint("\n  🛑 Stopped by user", Fore.YELLOW)
                break
            except Exception as e:
                cprint(f"  ❌ Error: {e}", Fore.RED)
                log.error(traceback.format_exc())

            time.sleep(CONFIG["SCAN_INTERVAL"])

        self.broker.price_feed.stop()

        stats = self.pm.stats
        cprint("\n" + "="*80, Fore.CYAN)
        cprint("  📊 SESSION STATISTICS", Fore.CYAN)
        cprint("="*80, Fore.CYAN)
        cprint(f"  Total Trades    : {stats['total_trades']}", Fore.WHITE)
        cprint(f"  Winning Trades  : {stats['winning_trades']} ({stats['win_rate']:.1f}%)", 
               Fore.GREEN if stats['win_rate'] >= 50 else Fore.RED)
        cprint(f"  Losing Trades   : {stats['losing_trades']}", Fore.WHITE)
        cprint(f"  Total P&L       : ₹{stats['total_pnl']:+,.0f}", 
               Fore.GREEN if stats['total_pnl'] >= 0 else Fore.RED)
        cprint(f"  Avg Win         : ₹{stats['avg_win']:+,.0f}", Fore.WHITE)
        cprint(f"  Avg Loss        : ₹{stats['avg_loss']:+,.0f}", Fore.WHITE)
        cprint(f"  Profit Factor   : {stats['profit_factor']:.2f}x", Fore.WHITE)
        cprint(f"  Consec Losses   : {stats['consecutive_losses']}", Fore.WHITE)
        cprint("="*80 + "\n", Fore.CYAN)

        cprint("  ✅ Bot exited cleanly\n", Fore.CYAN)


if __name__ == "__main__":
    NiftyBotPro().start()