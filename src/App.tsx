import { useEffect, useMemo, useState, type ReactElement, type ReactNode } from "react";
import './demo-layout.css';
import {
  AlertTriangle,
  Bell,
  Bot,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Copy,
  DatabaseZap,
  FileSpreadsheet,
  LayoutDashboard,
  Megaphone,
  MessageSquareText,
  PackageSearch,
  RefreshCw,
  Search,
  Settings,
  Sparkles,
  Store,
  UploadCloud,
  UserRound,
  Users,
  WalletCards,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Page =
  | "login"
  | "onboarding"
  | "dashboard"
  | "data"
  | "ai"
  | "marketing"
  | "customers"
  | "ledger"
  | "inventory"
  | "scripts"
  | "settings";

type CampaignStep = 1 | 2 | 3;

type DataSources = {
  store: boolean;
  customers: boolean;
  orders: boolean;
  ledger: boolean;
  inventory: boolean;
  campaignHistory: boolean;
  materials: boolean;
};

const navItems: Array<{ page: Page; label: string; icon: typeof LayoutDashboard }> = [
  { page: "dashboard", label: "经营看板", icon: LayoutDashboard },
  { page: "data", label: "数据接入", icon: DatabaseZap },
  { page: "ai", label: "AI经营问答", icon: Bot },
  { page: "marketing", label: "营销助手", icon: Megaphone },
  { page: "customers", label: "客户管理", icon: Users },
  { page: "ledger", label: "记账分析", icon: WalletCards },
  { page: "inventory", label: "库存提醒", icon: PackageSearch },
  { page: "scripts", label: "话术库", icon: MessageSquareText },
  { page: "settings", label: "门店设置", icon: Settings },
];

const storeProfile = {
  name: "小禾头皮护理",
  type: "美业护理",
  city: "北京",
  services: "头皮检测、头皮护理、肩颈放松",
  averageSpend: "198 元",
  hours: "10:00 - 21:00",
  audience: "25-40 岁女性上班族",
};

const metrics = [
  { label: "今日营收", value: "¥3,280", delta: "+8.4%", tone: "blue" },
  { label: "今日客流", value: "18", delta: "+6 人", tone: "green" },
  { label: "客单价", value: "¥182", delta: "-4.1%", tone: "orange" },
  { label: "复购率", value: "48%", delta: "+3.2%", tone: "purple" },
  { label: "待回访", value: "12", delta: "高优先", tone: "red" },
  { label: "库存提醒", value: "3", delta: "需处理", tone: "amber" },
];

const customers = [
  {
    name: "王女士",
    phone: "138****6021",
    tags: ["高价值", "待回访"],
    lastVisit: "2024-04-18",
    visits: 8,
    spend: "¥3,260",
    preference: "头皮护理套餐",
    status: "待回访",
  },
  {
    name: "李女士",
    phone: "186****1930",
    tags: ["沉睡客户"],
    lastVisit: "2024-03-29",
    visits: 4,
    spend: "¥1,280",
    preference: "肩颈放松",
    status: "待回访",
  },
  {
    name: "陈女士",
    phone: "159****4478",
    tags: ["新客"],
    lastVisit: "2024-05-18",
    visits: 1,
    spend: "¥198",
    preference: "头皮检测",
    status: "已跟进",
  },
  {
    name: "赵女士",
    phone: "177****2811",
    tags: ["活动敏感"],
    lastVisit: "2024-05-05",
    visits: 5,
    spend: "¥1,860",
    preference: "清爽控油护理",
    status: "待回访",
  },
];

const trendData = [
  { day: "周一", revenue: 2180, profit: 1160 },
  { day: "周二", revenue: 2460, profit: 1320 },
  { day: "周三", revenue: 1980, profit: 970 },
  { day: "周四", revenue: 3020, profit: 1680 },
  { day: "周五", revenue: 3860, profit: 2180 },
  { day: "周六", revenue: 4520, profit: 2620 },
  { day: "周日", revenue: 3280, profit: 1760 },
];

const expenseData = [
  { name: "耗材", value: 36, color: "#2563eb" },
  { name: "人工", value: 24, color: "#16a34a" },
  { name: "房租", value: 22, color: "#f59e0b" },
  { name: "营销", value: 18, color: "#7c3aed" },
];

const inventory = [
  { name: "控油护理精华", stock: 8, safe: 12, usage: 9, days: 5, status: "低库存" },
  { name: "头皮检测耗材", stock: 0, safe: 6, usage: 7, days: 0, status: "缺货" },
  { name: "舒缓修护套装", stock: 26, safe: 10, usage: 3, days: 24, status: "正常" },
  { name: "老款洗护旅行装", stock: 38, safe: 8, usage: 1, days: 60, status: "滞销" },
];

const scriptCategories = ["全部", "服务介绍", "客户回访", "活动邀约", "售后安抚", "朋友圈", "小红书", "社群公告"];

const scripts = [
  {
    title: "30天未到店老客回访",
    category: "客户回访",
    content:
      "亲爱的，看到你有一段时间没来做头皮护理啦。最近天气热，头皮更容易出油和发痒，本周五到周日老客回店护理套餐满199减30，想帮你先预约一个方便的时间。",
  },
  {
    title: "头皮护理服务介绍",
    category: "服务介绍",
    content:
      "我们的头皮护理会先做检测，再根据头皮出油、头屑、敏感情况安排深层清洁和舒缓修护，适合经常熬夜、头皮油腻和发根扁塌的客户。",
  },
  {
    title: "老客回店朋友圈",
    category: "朋友圈",
    content:
      "老朋友专属福利来了。本周五到周日，到店体验头皮护理套餐满199减30，帮你把头皮清爽感找回来。名额有限，想来的朋友私信我预约。",
  },
];

function App() {
  const publicDemo = new URLSearchParams(window.location.search).get("demo") === "1";
  useEffect(() => {
    if (publicDemo) document.documentElement.classList.add('public-demo');
    return () => { if (publicDemo) document.documentElement.classList.remove('public-demo'); };
  }, [publicDemo]);
  const [page, setPage] = useState<Page>(publicDemo ? "dashboard" : "login");
  const [campaignStep, setCampaignStep] = useState<CampaignStep>(1);
  const [selectedGoal, setSelectedGoal] = useState("老客回店");
  const [selectedCustomer, setSelectedCustomer] = useState(customers[0]);
  const [dataSources, setDataSources] = useState<DataSources>({
    store: true,
    customers: true,
    orders: true,
    ledger: true,
    inventory: true,
    campaignHistory: false,
    materials: false,
  });
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      text: "我已经读取了小禾头皮护理本周经营数据。你可以直接问我客流、复购、利润、库存和营销建议。",
    },
  ]);
  const [scriptFilter, setScriptFilter] = useState("全部");

  const filteredScripts = useMemo(
    () => scripts.filter((script) => scriptFilter === "全部" || script.category === scriptFilter),
    [scriptFilter],
  );

  const goToPage = (target: Page) => {
    setPage(target);
    if (target === "marketing") {
      setCampaignStep(1);
    }
  };

  if (page === "login") {
    return <LoginPage onDemo={() => setPage("onboarding")} />;
  }

  return (
    <div className="app-shell">
      <Sidebar current={page} onNavigate={goToPage} />
      <main className="main">
        {publicDemo && <div style={{padding:"10px 24px",background:"#edf4ff",color:"#294a75",fontSize:12}}>公开演示 · 示例门店与经营数据 · AI 回复和营销内容为预设样例，未连接真实业务系统。可从经营看板进入客户管理或营销助手。</div>}
        <Topbar />
        <div className="page-body">
          {page === "onboarding" && <OnboardingPage onFinish={() => setPage("dashboard")} />}
          {page === "dashboard" && <DashboardPage onNavigate={goToPage} />}
          {page === "data" && (
            <DataIntakePage
              dataSources={dataSources}
              setDataSources={setDataSources}
              onNavigate={goToPage}
            />
          )}
          {page === "ai" && (
            <AiPage
              messages={chatMessages}
              setMessages={setChatMessages}
              onNavigate={goToPage}
              dataSources={dataSources}
            />
          )}
          {page === "marketing" && (
            <MarketingPage
              step={campaignStep}
              setStep={setCampaignStep}
              selectedGoal={selectedGoal}
              setSelectedGoal={setSelectedGoal}
              dataSources={dataSources}
            />
          )}
          {page === "customers" && (
            <CustomersPage selected={selectedCustomer} setSelected={setSelectedCustomer} />
          )}
          {page === "ledger" && <LedgerPage />}
          {page === "inventory" && <InventoryPage onNavigate={goToPage} />}
          {page === "scripts" && (
            <ScriptsPage filter={scriptFilter} setFilter={setScriptFilter} filteredScripts={filteredScripts} />
          )}
          {page === "settings" && <SettingsPage />}
        </div>
      </main>
    </div>
  );
}

function LoginPage({ onDemo }: { onDemo: () => void }) {
  return (
    <div className="login-page">
      <div className="login-visual">
        <div className="store-visual">
          <Store size={74} />
          <div className="floating-card revenue">今日营收 +8.4%</div>
          <div className="floating-card ai">AI 建议已生成</div>
        </div>
      </div>
      <section className="login-card">
        <div className="brand-mark">AI</div>
        <h1>实体门店 AI 经营助手</h1>
        <p>帮小店老板看经营、做营销、管客户、算利润</p>
        <label>
          手机号
          <input placeholder="请输入手机号" />
        </label>
        <label>
          验证码
          <div className="inline-input">
            <input placeholder="请输入验证码" />
            <button className="text-button">获取验证码</button>
          </div>
        </label>
        <button className="primary wide">进入我的门店</button>
        <button className="secondary wide" onClick={onDemo}>
          体验示例门店
        </button>
        <div className="capability-row">
          <Capability icon={<LayoutDashboard size={18} />} title="经营看板" text="看清每日经营变化" />
          <Capability icon={<Megaphone size={18} />} title="营销助手" text="自动生成活动内容" />
          <Capability icon={<Users size={18} />} title="客户管理" text="沉淀复购客户" />
        </div>
      </section>
    </div>
  );
}

function Capability({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="capability">
      {icon}
      <div>
        <strong>{title}</strong>
        <span>{text}</span>
      </div>
    </div>
  );
}

function Sidebar({ current, onNavigate }: { current: Page; onNavigate: (page: Page) => void }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span>AI</span>
        <div>
          <strong>实体门店</strong>
          <small>AI 经营助手</small>
        </div>
      </div>
      <nav>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.page}
              className={`nav-item ${current === item.page ? "active" : ""}`}
              onClick={() => onNavigate(item.page)}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="guide-card">
        <Sparkles size={20} />
        <strong>新手引导</strong>
        <span>3 分钟快速上手</span>
      </div>
    </aside>
  );
}

function Topbar() {
  return (
    <header className="topbar">
      <div className="store-select">
        <Store size={18} />
        <span>{storeProfile.name}</span>
      </div>
      <div className="topbar-actions">
        <span>2024-05-20 星期一</span>
        <button className="icon-btn" aria-label="通知">
          <Bell size={18} />
          <i />
        </button>
        <div className="user-chip">
          <UserRound size={18} />
          店长
        </div>
      </div>
    </header>
  );
}

function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="page-header">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}

function OnboardingPage({ onFinish }: { onFinish: () => void }) {
  return (
    <>
      <PageHeader title="门店初始化设置" subtitle="先告诉 AI 你经营的是一家什么店，后续建议会围绕这些信息生成。" />
      <div className="onboarding-grid">
        <section className="card large">
          <Stepper current={4} labels={["基础信息", "经营情况", "当前痛点", "AI 风格"]} />
          <div className="form-grid">
            <Field label="门店名称" value={storeProfile.name} />
            <Field label="门店类型" value={storeProfile.type} />
            <Field label="所在城市" value={storeProfile.city} />
            <Field label="主营产品 / 服务" value={storeProfile.services} />
            <Field label="客单价" value={storeProfile.averageSpend} />
            <Field label="营业时间" value={storeProfile.hours} />
            <Field label="目标客户" value={storeProfile.audience} wide />
          </div>
          <h2>当前痛点</h2>
          <div className="choice-grid">
            {["老客复购低", "不会写朋友圈", "客户沉睡多", "账算不清", "库存经常乱", "员工话术不统一"].map((item) => (
              <button className="choice selected" key={item}>
                <CheckCircle2 size={16} />
                {item}
              </button>
            ))}
          </div>
          <h2>AI 风格设置</h2>
          <div className="pill-row">
            {["亲切自然", "温柔", "中等优惠", "避免过度营销"].map((item) => (
              <span className="pill selected" key={item}>
                {item}
              </span>
            ))}
          </div>
          <div className="footer-actions">
            <button className="secondary">上一步</button>
            <button className="primary" onClick={onFinish}>
              生成我的门店经营助手
            </button>
          </div>
        </section>
        <AiPanel
          title="初始化后 AI 将自动生成"
          items={[
            "经营看板的关键指标和今日任务",
            "适合门店客群的营销活动建议",
            "沉睡客户回访话术和客户分层",
            "利润、库存、话术的默认分析口径",
          ]}
        />
      </div>
    </>
  );
}

function Field({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return (
    <label className={wide ? "wide-field" : ""}>
      {label}
      <input value={value} readOnly />
    </label>
  );
}

function Stepper({ current, labels }: { current: number; labels: string[] }) {
  return (
    <div className="stepper">
      {labels.map((label, index) => (
        <div className={`step ${index + 1 <= current ? "done" : ""}`} key={label}>
          <span>{index + 1}</span>
          {label}
        </div>
      ))}
    </div>
  );
}

function DashboardPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <>
      <PageHeader title="经营看板" subtitle="今天的经营状态、客户提醒和 AI 建议都在这里。" />
      <div className="metric-grid">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>
      <div className="dashboard-grid">
        <section className="card span-2">
          <div className="section-title">
            <div>
              <h2>今日建议优先做老客回访</h2>
              <p>近 30 天未到店老客 12 人，其中 5 人为高价值客户。</p>
            </div>
            <Sparkles className="blue-icon" />
          </div>
          <div className="suggestion-list">
            <ActionCard title="生成今日营销" text="围绕老客回店护理周生成朋友圈、小红书和社群话术。" onClick={() => onNavigate("marketing")} />
            <ActionCard title="查看待回访客户" text="打开客户管理并优先处理高价值沉睡客户。" onClick={() => onNavigate("customers")} />
            <ActionCard title="记录今日营收" text="补充今日收入和支出，更新利润分析。" onClick={() => onNavigate("ledger")} />
          </div>
        </section>
        <section className="card">
          <h2>今日任务</h2>
          <Task text="回访 12 位 30 天未到店老客" status="高" />
          <Task text="发布老客回店护理周朋友圈" status="中" />
          <Task text="检查 3 个库存提醒" status="中" />
          <Task text="记录今日营收和耗材支出" status="低" />
        </section>
        <section className="card">
          <h2>本周营收趋势</h2>
          <ChartBox>
            <AreaChart data={trendData}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke="#2563eb" fill="#dbeafe" />
            </AreaChart>
          </ChartBox>
        </section>
        <section className="card">
          <h2>客户提醒</h2>
          {customers.slice(0, 3).map((customer) => (
            <div className="compact-row" key={customer.name}>
              <div>
                <strong>{customer.name}</strong>
                <span>{customer.preference}</span>
              </div>
              <Badge text={customer.status} />
            </div>
          ))}
        </section>
        <section className="card">
          <h2>库存提醒</h2>
          {inventory.slice(0, 3).map((item) => (
            <div className="compact-row" key={item.name}>
              <div>
                <strong>{item.name}</strong>
                <span>预计可用 {item.days} 天</span>
              </div>
              <Badge text={item.status} danger={item.status !== "正常"} />
            </div>
          ))}
        </section>
      </div>
    </>
  );
}

function MetricCard({ label, value, delta, tone }: { label: string; value: string; delta: string; tone: string }) {
  return (
    <section className={`metric-card ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <em>{delta}</em>
    </section>
  );
}

function ActionCard({ title, text, onClick }: { title: string; text: string; onClick: () => void }) {
  return (
    <button className="action-card" aria-label={title} onClick={onClick}>
      <div>
        <strong>{title}</strong>
        <span>{text}</span>
      </div>
      <ChevronRight size={18} />
    </button>
  );
}

function Task({ text, status }: { text: string; status: string }) {
  return (
    <div className="task-row">
      <CheckCircle2 size={18} />
      <span>{text}</span>
      <Badge text={status} />
    </div>
  );
}

function DataIntakePage({
  dataSources,
  setDataSources,
  onNavigate,
}: {
  dataSources: DataSources;
  setDataSources: (sources: DataSources) => void;
  onNavigate: (page: Page) => void;
}) {
  const connect = (key: keyof DataSources) => {
    setDataSources({ ...dataSources, [key]: true });
  };

  const connectedCount = Object.values(dataSources).filter(Boolean).length;
  const readiness = Math.round((connectedCount / Object.keys(dataSources).length) * 100);

  return (
    <>
      <PageHeader title="数据接入" subtitle="让 AI 经营问答和营销助手知道你的门店真实情况。" />
      <div className="data-intake-layout">
        <section className="card large">
          <div className="data-progress">
            <div>
              <span>资料完整度</span>
              <strong>{readiness}%</strong>
              <p>已接入 {connectedCount} / {Object.keys(dataSources).length} 类核心资料</p>
            </div>
            <div className="progress-track">
              <i style={{ width: `${readiness}%` }} />
            </div>
          </div>

          <h2>营销内容输出资料</h2>
          <p className="section-note">
            这些资料会直接影响营销助手生成的活动主题、目标客户、优惠力度、朋友圈文案、小红书文案和社群话术。
          </p>
          <div className="source-grid">
            <DataSourceCard
              title="门店资料"
              status={dataSources.store}
              detail="行业、城市、主营服务、客单价、目标客户、AI 风格"
              primary="已接入门店资料"
              actionLabel="更新门店资料"
              onAction={() => onNavigate("settings")}
            />
            <DataSourceCard
              title="客户分层数据"
              status={dataSources.customers}
              detail="高价值客户、沉睡客户、30 天未到店、活动敏感客户"
              primary="客户数据已接入"
              actionLabel="查看客户数据"
              onAction={() => onNavigate("customers")}
            />
            <DataSourceCard
              title="订单与项目数据"
              status={dataSources.orders}
              detail="项目销量、成交金额、服务偏好、周末/工作日成交差异"
              primary="订单数据已接入"
              actionLabel="查看经营看板"
              onAction={() => onNavigate("dashboard")}
            />
            <DataSourceCard
              title="历史活动数据"
              status={dataSources.campaignHistory}
              detail="过往活动主题、优惠力度、触达渠道、转化表现"
              primary="历史活动数据已接入"
              actionLabel="接入历史活动数据"
              onAction={() => connect("campaignHistory")}
            />
            <DataSourceCard
              title="素材与话术"
              status={dataSources.materials}
              detail="门店照片、服务卖点、朋友圈模板、小红书标题、社群话术"
              primary="素材与话术已接入"
              actionLabel="接入素材与话术"
              onAction={() => connect("materials")}
            />
            <DataSourceCard
              title="库存与成本"
              status={dataSources.inventory}
              detail="可清库存产品、耗材风险、适合搭配活动的项目"
              primary="库存数据已接入"
              actionLabel="查看库存提醒"
              onAction={() => onNavigate("inventory")}
            />
          </div>
          <div className="footer-actions">
            <button className="secondary" onClick={() => onNavigate("ai")}>
              去经营问答
            </button>
            <button className="primary" onClick={() => onNavigate("marketing")}>
              去生成营销内容
            </button>
          </div>
        </section>

        <aside className="card ai-panel">
          <h2>
            <Sparkles size={18} />
            接入后能生成什么
          </h2>
          <div className="intake-preview">
            <strong>活动策略</strong>
            <span>根据沉睡客户、项目销量、库存风险推荐活动目标。</span>
          </div>
          <div className="intake-preview">
            <strong>多平台文案</strong>
            <span>结合门店风格输出朋友圈、小红书、社群/私聊内容。</span>
          </div>
          <div className="intake-preview">
            <strong>客户触达</strong>
            <span>按客户标签生成不同话术，避免所有客户同一套说法。</span>
          </div>
          <div className="intake-preview">
            <strong>数据依据</strong>
            <span>营销结果页会展示内容来自哪些数据，增强可信度。</span>
          </div>
        </aside>
      </div>
    </>
  );
}

function DataSourceCard({
  title,
  status,
  detail,
  primary,
  actionLabel,
  onAction,
}: {
  title: string;
  status: boolean;
  detail: string;
  primary: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <article className={`source-card ${status ? "connected" : ""}`}>
      <div className="source-icon">{status ? <CheckCircle2 size={20} /> : <UploadCloud size={20} />}</div>
      <div>
        <h3>{title}</h3>
        <p>{detail}</p>
        <strong>{status ? primary : "待接入"}</strong>
      </div>
      <button className={status ? "secondary compact" : "primary compact"} onClick={onAction}>
        {actionLabel}
      </button>
    </article>
  );
}

function AiPage({
  messages,
  setMessages,
  onNavigate,
  dataSources,
}: {
  messages: Array<{ role: string; text: string }>;
  setMessages: (messages: Array<{ role: string; text: string }>) => void;
  onNavigate: (page: Page) => void;
  dataSources: DataSources;
}) {
  const ask = (question: string) => {
    setMessages([
      ...messages,
      { role: "user", text: question },
      {
        role: "assistant",
        text: "本周头皮护理套餐卖得最好，共成交 32 单，占服务收入 46%。建议继续做老客回店护理周，并优先触达 30 天未到店老客。",
      },
    ]);
  };

  return (
    <>
      <PageHeader title="AI 经营问答" subtitle="不用翻复杂报表，直接问 AI 今天该关注什么。" />
      <div className="ai-layout">
        <section className="card prompt-list">
          <h2>推荐问题</h2>
          {["这周哪个项目卖得最好？", "哪些客户超过 30 天没来了？", "今天应该发什么活动？", "本月收入比上月少在哪里？"].map(
            (question) => (
              <button key={question} onClick={() => ask(question)}>
                {question}
              </button>
            ),
          )}
        </section>
        <section className="card chat-panel">
          <div className="chat-thread">
            {messages.map((message, index) => (
              <div className={`chat-message ${message.role}`} key={`${message.role}-${index}`}>
                {message.text}
              </div>
            ))}
          </div>
          <div className="chat-actions">
            <button className="primary" onClick={() => onNavigate("marketing")}>
              生成营销方案
            </button>
            <button className="secondary" onClick={() => onNavigate("customers")}>
              查看相关客户
            </button>
          </div>
        </section>
        <AiPanel
          title="已接入数据"
          items={[
            "门店资料：小禾头皮护理",
            dataSources.customers ? "客户数据：256 位客户" : "客户数据未接入",
            dataSources.orders ? "订单数据：近 30 天 486 条" : "订单数据未接入",
            dataSources.campaignHistory ? "历史活动数据已接入" : "历史活动数据未接入",
            dataSources.materials ? "素材与话术已接入" : "素材与话术未接入",
          ]}
        />
      </div>
    </>
  );
}

function MarketingPage({
  step,
  setStep,
  selectedGoal,
  setSelectedGoal,
  dataSources,
}: {
  step: CampaignStep;
  setStep: (step: CampaignStep) => void;
  selectedGoal: string;
  setSelectedGoal: (goal: string) => void;
  dataSources: DataSources;
}) {
  const goals = ["老客回店", "新客引流", "节日活动", "清库存", "工作日提升客流"];

  return (
    <>
      <PageHeader title="营销助手" subtitle="从活动目标到朋友圈、小红书、社群话术，一次生成。" />
      <section className="card">
        <Stepper current={step} labels={["选择活动目标", "填写活动信息", "生成结果"]} />
        <MarketingDataStrip dataSources={dataSources} />
        {step === 1 && (
          <>
            <div className="marketing-logic-card">
              <div>
                <strong>本次推荐逻辑</strong>
                <span>
                  客户分层显示 30 天未到店老客较多，订单数据中头皮护理套餐销量最高，适合优先做“老客回店”。
                </span>
              </div>
              <Badge text="可生成朋友圈 / 小红书 / 社群话术" />
            </div>
            <div className="goal-grid">
              {goals.map((goal) => (
                <button
                  className={`goal-card ${selectedGoal === goal ? "selected" : ""}`}
                  key={goal}
                  onClick={() => setSelectedGoal(goal)}
                >
                  <Megaphone size={22} />
                  <strong>{goal}</strong>
                  <span>{goal === "老客回店" ? "适合沉睡客户和复购提升" : "AI 将按门店情况生成活动"}</span>
                </button>
              ))}
            </div>
            <div className="footer-actions">
              <button className="primary" onClick={() => setStep(2)}>
                下一步
              </button>
            </div>
          </>
        )}
        {step === 2 && (
          <div className="marketing-form-layout">
            <div className="form-grid">
              <Field label="活动名称" value="老客回店护理周" />
              <Field label="活动时间" value="本周五-周日" />
              <Field label="目标客户" value="30天未到店老客" />
              <Field label="主推项目" value="头皮护理套餐" />
              <Field label="优惠力度" value="满199减30" />
              <Field label="发布平台" value="朋友圈、小红书、社群" />
              <label className="wide-field">
                备注要求
                <textarea value="语气亲切自然，避免强推，突出老客专属福利。" readOnly />
              </label>
            </div>
            <AiPanel title="AI 推荐" items={["目标客户响应优惠活动较高", "建议周五上午发布第一条朋友圈", "活动后沉淀到客户回访任务"]} />
            <div className="footer-actions span-2">
              <button className="secondary" onClick={() => setStep(1)}>
                上一步
              </button>
              <button className="primary" onClick={() => setStep(3)}>
                生成活动内容
              </button>
            </div>
          </div>
        )}
        {step === 3 && <CampaignResults dataSources={dataSources} />}
      </section>
    </>
  );
}

function MarketingDataStrip({ dataSources }: { dataSources: DataSources }) {
  const rows = [
    { label: "门店资料", connected: dataSources.store, detail: "行业、客群、文案风格" },
    { label: "客户分层", connected: dataSources.customers, detail: "30天未到店、高价值、活动敏感" },
    { label: "订单项目", connected: dataSources.orders, detail: "热销项目、客单价、成交时段" },
    { label: "历史活动数据", connected: dataSources.campaignHistory, detail: "优惠力度、渠道转化" },
    { label: "素材与话术", connected: dataSources.materials, detail: "服务卖点、模板、门店语气" },
  ];

  return (
    <div className="marketing-data-strip">
      {rows.map((row) => (
        <div className={row.connected ? "ready" : ""} key={row.label}>
          <CheckCircle2 size={16} />
          <strong>{row.connected ? `已接入${row.label}` : `未接入${row.label}`}</strong>
          <span>{row.detail}</span>
        </div>
      ))}
    </div>
  );
}

function CampaignResults({ dataSources }: { dataSources: DataSources }) {
  return (
    <div className="campaign-results">
      <div className="campaign-overview">
        <div>
          <span>活动名称</span>
          <strong>老客回店护理周</strong>
        </div>
        <div>
          <span>活动时间</span>
          <strong>本周五-周日</strong>
        </div>
        <div>
          <span>目标客户</span>
          <strong>30天未到店老客</strong>
        </div>
        <div>
          <span>发布平台</span>
          <strong>朋友圈、小红书、社群</strong>
        </div>
      </div>
      <div className="output-grid">
        <OutputCard title="活动方案" icon={<ClipboardList />}>
          <ul>
            <li>通过优惠刺激老客回店，提升到店转化与复购率。</li>
            <li>结合周末到店高峰，主推头皮护理套餐。</li>
            <li>朋友圈、小红书、社群多平台联动。</li>
            <li>设置限时福利和名额提醒，提升行动力。</li>
          </ul>
          <CardActions labels={["复制方案", "加入营销日历"]} />
        </OutputCard>
        <OutputCard title="朋友圈文案" icon={<Megaphone />}>
          <p>
            最近有没有觉得头皮油腻、头发扁塌？小禾给大家准备了「老客回店护理周」福利。本周五-周日，到店体验头皮护理套餐，满199减30。
          </p>
          <CardActions labels={["复制", "改短一点", "重新生成"]} />
        </OutputCard>
        <OutputCard title="小红书文案" icon={<Search />}>
          <strong>标题建议</strong>
          <p>头皮护理真的太舒服了！老客福利周来啦</p>
          <p>拯救油腻头皮，老客回店护理福利限时 3 天。</p>
          <CardActions labels={["复制", "加入营销日历"]} />
        </OutputCard>
        <OutputCard title="社群/私聊话术" icon={<MessageSquareText />}>
          <p>
            亲爱的，看到你很久没来做头皮护理啦。本周五到周日有老客回店活动，头皮护理套餐满199减30，想帮你预约个方便的时间。
          </p>
          <CardActions labels={["复制", "加入客户回访任务"]} />
        </OutputCard>
      </div>
      <section className="card result-evidence">
        <h2>
          <DatabaseZap size={18} />
          本次内容生成依据
        </h2>
        <div className="evidence-grid">
          <EvidenceItem title="客户分层" text="目标客户锁定为 30 天未到店老客，其中高价值客户 5 人。" />
          <EvidenceItem title="订单项目" text="头皮护理套餐本周成交 32 单，占服务收入 46%。" />
          <EvidenceItem title="门店风格" text="沿用初始化中的亲切自然语气，避免过度营销。" />
          <EvidenceItem
            title="历史活动"
            text={dataSources.campaignHistory ? "参考历史活动转化，优惠力度保持中等。" : "未接入历史活动，当前使用行业默认策略。"}
          />
          <EvidenceItem
            title="素材话术"
            text={dataSources.materials ? "已使用服务卖点和既有话术，文案更贴近门店口吻。" : "未接入素材，当前使用通用服务描述。"}
          />
        </div>
      </section>
    </div>
  );
}

function EvidenceItem({ title, text }: { title: string; text: string }) {
  return (
    <div className="evidence-item">
      <strong>{title}</strong>
      <span>{text}</span>
    </div>
  );
}

function OutputCard({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <section className="output-card">
      <h2>
        {icon}
        {title}
      </h2>
      {children}
    </section>
  );
}

function CardActions({ labels }: { labels: string[] }) {
  return (
    <div className="card-actions">
      {labels.map((label, index) => (
        <button className={index === 0 ? "secondary" : "ghost"} key={label}>
          {label === "重新生成" ? <RefreshCw size={14} /> : <Copy size={14} />}
          {label}
        </button>
      ))}
    </div>
  );
}

function CustomersPage({
  selected,
  setSelected,
}: {
  selected: (typeof customers)[number];
  setSelected: (customer: (typeof customers)[number]) => void;
}) {
  return (
    <>
      <PageHeader title="客户管理" subtitle="识别高价值、沉睡和待回访客户，直接生成跟进话术。" />
      <div className="customers-layout">
        <section className="card">
          <div className="metric-grid small">
            <MetricCard label="总客户" value="256" delta="+18" tone="blue" />
            <MetricCard label="待回访" value="12" delta="高优先" tone="red" />
            <MetricCard label="沉睡客户" value="48" delta="+6" tone="orange" />
          </div>
          <div className="filter-row">
            {["全部", "高价值", "沉睡客户", "待回访"].map((filter) => (
              <button className="filter-chip" key={filter}>
                {filter}
              </button>
            ))}
          </div>
          <table>
            <thead>
              <tr>
                <th>客户</th>
                <th>标签</th>
                <th>最近到店</th>
                <th>消费次数</th>
                <th>累计消费</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.name}>
                  <td>
                    <strong>{customer.name}</strong>
                    <span>{customer.phone}</span>
                  </td>
                  <td>
                    <div className="tag-row">
                      {customer.tags.map((tag) => (
                        <Badge text={tag} key={tag} />
                      ))}
                    </div>
                  </td>
                  <td>{customer.lastVisit}</td>
                  <td>{customer.visits}</td>
                  <td>{customer.spend}</td>
                  <td>
                    <button className="secondary compact" onClick={() => setSelected(customer)}>
                      查看{customer.name}详情
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <aside className="card customer-drawer">
          <h2>{selected.name}</h2>
          <p>{selected.phone}</p>
          <div className="tag-row">
            {selected.tags.map((tag) => (
              <Badge text={tag} key={tag} danger={tag === "待回访"} />
            ))}
          </div>
          <div className="detail-list">
            <Detail label="最近到店" value={selected.lastVisit} />
            <Detail label="累计消费" value={selected.spend} />
            <Detail label="偏好项目" value={selected.preference} />
            <Detail label="AI 建议" value="该客户适合用老客专属福利邀约，建议周末上午联系。" />
          </div>
          <h3>推荐回访话术</h3>
          <div className="script-box">
            您好{selected.name}，最近还好吗？我们本周有老客回店护理周，头皮护理套餐满199减30，刚好适合你上次做的项目延续护理。
          </div>
          <div className="footer-actions vertical">
            <button className="primary">生成回访话术</button>
            <button className="secondary">标记已回访</button>
          </div>
        </aside>
      </div>
    </>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="detail-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function LedgerPage() {
  return (
    <>
      <PageHeader title="记账分析" subtitle="记录每日收支，AI 帮你看真实利润和成本变化。" />
      <div className="metric-grid">
        <MetricCard label="今日营收" value="¥3,280" delta="+8.4%" tone="blue" />
        <MetricCard label="今日支出" value="¥1,160" delta="+5.1%" tone="orange" />
        <MetricCard label="今日利润" value="¥2,160" delta="+6.8%" tone="green" />
        <MetricCard label="利润率" value="65.8%" delta="+2.1%" tone="purple" />
      </div>
      <div className="dashboard-grid">
        <section className="card span-2">
          <h2>营收与利润趋势</h2>
          <ChartBox>
            <BarChart data={trendData}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip />
              <Bar dataKey="revenue" fill="#93c5fd" radius={[6, 6, 0, 0]} />
              <Bar dataKey="profit" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ChartBox>
        </section>
        <section className="card">
          <h2>支出占比</h2>
          <ChartBox>
            <PieChart>
              <Pie data={expenseData} dataKey="value" innerRadius={52} outerRadius={78}>
                {expenseData.map((item) => (
                  <Cell key={item.name} fill={item.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ChartBox>
        </section>
        <AiPanel
          title="利润 AI 分析"
          items={["本周利润率较上周提升 2.1%", "头皮护理套餐贡献最高利润", "耗材支出上涨，建议检查控油精华用量", "下午低峰可做老客到店券"]}
        />
      </div>
    </>
  );
}

function InventoryPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <>
      <PageHeader title="库存提醒" subtitle="提前处理低库存、缺货、临期和滞销风险。" />
      <div className="inventory-layout">
        <section className="card">
          <div className="filter-row">
            {["全部", "低库存", "缺货", "临期", "滞销"].map((filter) => (
              <button className="filter-chip" key={filter}>
                {filter}
              </button>
            ))}
          </div>
          <table>
            <thead>
              <tr>
                <th>名称</th>
                <th>当前库存</th>
                <th>安全库存</th>
                <th>周消耗</th>
                <th>预计可用</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item.name}>
                  <td>
                    <strong>{item.name}</strong>
                  </td>
                  <td>{item.stock}</td>
                  <td>{item.safe}</td>
                  <td>{item.usage}</td>
                  <td>{item.days} 天</td>
                  <td>
                    <Badge text={item.status} danger={item.status !== "正常"} />
                  </td>
                  <td>
                    <button className="secondary compact" onClick={() => onNavigate("marketing")}>
                      加入清库存活动
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <AiPanel
          title="库存 AI 建议"
          items={["头皮检测耗材已经缺货，会影响明天预约", "控油护理精华预计 5 天后不足", "老款洗护旅行装可结合老客活动清库存"]}
        />
      </div>
    </>
  );
}

function ScriptsPage({
  filter,
  setFilter,
  filteredScripts,
}: {
  filter: string;
  setFilter: (filter: string) => void;
  filteredScripts: typeof scripts;
}) {
  return (
    <>
      <PageHeader title="话术库" subtitle="沉淀服务介绍、客户回访、活动邀约和售后回复。" />
      <div className="scripts-layout">
        <section className="card category-list">
          {scriptCategories.map((category) => (
            <button className={filter === category ? "active" : ""} key={category} onClick={() => setFilter(category)}>
              {category}
            </button>
          ))}
        </section>
        <section className="card script-list">
          <div className="search-box">
            <Search size={16} />
            <input placeholder="搜索话术" />
          </div>
          {filteredScripts.map((script) => (
            <article className="script-card" key={script.title}>
              <Badge text={script.category} />
              <h2>{script.title}</h2>
              <p>{script.content}</p>
              <CardActions labels={["复制", "生成变体"]} />
            </article>
          ))}
        </section>
        <AiPanel title="AI 变体建议" items={["更亲切", "更简短", "更专业", "更有成交感"]} />
      </div>
    </>
  );
}

function SettingsPage() {
  return (
    <>
      <PageHeader title="门店设置" subtitle="维护门店资料、经营信息、AI 偏好和通知提醒。" />
      <div className="settings-layout">
        <section className="card large">
          <div className="form-grid">
            <Field label="门店名称" value={storeProfile.name} />
            <Field label="门店类型" value={storeProfile.type} />
            <Field label="所在城市" value={storeProfile.city} />
            <Field label="主营服务" value={storeProfile.services} />
            <Field label="客单价" value={storeProfile.averageSpend} />
            <Field label="营业时间" value={storeProfile.hours} />
            <Field label="目标客户" value={storeProfile.audience} wide />
          </div>
          <h2>AI 生成偏好</h2>
          <div className="pill-row">
            {["亲切自然", "温柔", "中等优惠", "避免过度营销", "每日经营摘要", "库存提醒"].map((item) => (
              <span className="pill selected" key={item}>
                {item}
              </span>
            ))}
          </div>
          <div className="footer-actions">
            <button className="secondary">重置</button>
            <button className="primary">保存设置</button>
          </div>
        </section>
        <AiPanel title="设置影响范围" items={["营销助手默认文案风格", "AI 问答经营分析口径", "客户回访话术语气", "库存和任务提醒频率"]} />
      </div>
    </>
  );
}

function AiPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <aside className="card ai-panel">
      <h2>
        <Sparkles size={18} />
        {title}
      </h2>
      {items.map((item) => (
        <div className="ai-item" key={item}>
          <CheckCircle2 size={16} />
          <span>{item}</span>
        </div>
      ))}
    </aside>
  );
}

function Badge({ text, danger }: { text: string; danger?: boolean }) {
  return <span className={`badge ${danger ? "danger" : ""}`}>{text}</span>;
}

function ChartBox({ children }: { children: ReactNode }) {
  return (
    <div className="chart-box">
      <ResponsiveContainer width="100%" height={240} minWidth={240} minHeight={180}>
        {children as ReactElement}
      </ResponsiveContainer>
    </div>
  );
}

export default App;
