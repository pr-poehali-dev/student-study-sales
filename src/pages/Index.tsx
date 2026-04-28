import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMAGE = "https://cdn.poehali.dev/projects/b380b5e3-d103-4a80-8f4d-226adb8c7954/files/87bfe75d-d47e-4a8f-bb77-6b13f60c32f5.jpg";

const GET_ORDER_URL = "https://functions.poehali.dev/6c0971a2-a6d5-45e0-9825-4d03ed5aa200";

type Page = "home" | "catalog" | "profile" | "cart" | "contacts" | "faq" | "success";

const SUBJECTS = [
  { icon: "Calculator", label: "Математика", count: 1420, color: "from-purple-500 to-blue-500" },
  { icon: "FlaskConical", label: "Физика", count: 830, color: "from-blue-500 to-cyan-400" },
  { icon: "Microscope", label: "Химия", count: 640, color: "from-cyan-400 to-teal-400" },
  { icon: "BookOpen", label: "Литература", count: 1150, color: "from-pink-500 to-rose-500" },
  { icon: "Globe", label: "История", count: 980, color: "from-orange-500 to-amber-400" },
  { icon: "Cpu", label: "Информатика", count: 760, color: "from-violet-500 to-purple-400" },
  { icon: "Languages", label: "Английский", count: 1300, color: "from-green-500 to-emerald-400" },
  { icon: "BarChart3", label: "Экономика", count: 590, color: "from-rose-500 to-pink-400" },
];

const WORK_TYPES = ["Все работы", "Курсовые", "Рефераты", "Дипломные", "Контрольные", "Эссе", "Шпаргалки"];

const WORKS = [
  { id: 1, title: "Интегралы и дифференциальные уравнения", subject: "Математика", type: "Курсовая", price: 890, rating: 4.9, reviews: 124, pages: 32, badge: "hot" },
  { id: 2, title: "Законы термодинамики и их применение", subject: "Физика", type: "Реферат", price: 350, rating: 4.8, reviews: 87, pages: 18, badge: "new" },
  { id: 3, title: "Анализ романа «Мастер и Маргарита»", subject: "Литература", type: "Эссе", price: 450, rating: 4.7, reviews: 203, pages: 14, badge: "" },
  { id: 4, title: "Органическая химия: алканы и алкены", subject: "Химия", type: "Курсовая", price: 780, rating: 4.9, reviews: 56, pages: 28, badge: "new" },
  { id: 5, title: "Вторая мировая война: причины и итоги", subject: "История", type: "Реферат", price: 380, rating: 4.6, reviews: 142, pages: 22, badge: "" },
  { id: 6, title: "Алгоритмы сортировки и их сложность", subject: "Информатика", type: "Курсовая", price: 920, rating: 5.0, reviews: 78, pages: 40, badge: "hot" },
];

const FAQ_ITEMS = [
  { q: "Как гарантируется оригинальность работ?", a: "Все работы проверяются через антиплагиат-систему. Уровень оригинальности указан в карточке каждой работы. Мы гарантируем минимум 70% уникальности." },
  { q: "Можно ли вернуть деньги?", a: "Да! В течение 14 дней после покупки вы можете запросить возврат, если работа не соответствует описанию. Деньги вернутся на счёт в течение 3 рабочих дней." },
  { q: "Как быстро я получу работу?", a: "Мгновенно после оплаты — файл доступен для скачивания в личном кабинете. Никаких ожиданий!" },
  { q: "Какие форматы файлов доступны?", a: "PDF и DOCX для всех работ. Некоторые материалы также доступны в форматах XLSX и PPTX." },
  { q: "Есть ли скидки для студентов?", a: "Конечно! При регистрации все новые пользователи получают скидку 15% на первую покупку. Также действует программа лояльности с накопительными баллами." },
];

const CART_DEFAULT = [
  { id: 1, title: "Интегралы и дифференциальные уравнения", subject: "Математика", price: 890 },
  { id: 6, title: "Алгоритмы сортировки и их сложность", subject: "Информатика", price: 920 },
];

export default function Index() {
  const [page, setPage] = useState<Page>("home");
  const [activeType, setActiveType] = useState("Все работы");
  const [search, setSearch] = useState("");
  const [cartItems, setCartItems] = useState(CART_DEFAULT);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [successPaymentId, setSuccessPaymentId] = useState<string | null>(null);

  // Определяем возврат с ЮKassa по ?payment=success, payment_id берём из URL или sessionStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success') {
      const pid = params.get('payment_id')
        || sessionStorage.getItem('ym_payment_id')
        || 'unknown';
      sessionStorage.removeItem('ym_payment_id');
      setSuccessPaymentId(pid);
      setPage('success');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const cartTotal = cartItems.reduce((sum, i) => sum + i.price, 0);
  const nav = (p: Page) => { setPage(p); setMobileMenu(false); window.scrollTo(0, 0); };

  return (
    <div className="min-h-screen bg-background font-body">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5" style={{ background: 'rgba(10,9,22,0.85)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button onClick={() => nav("home")} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #a855f7, #00d4ff)' }}>
              <span className="text-white font-display font-bold text-sm">У</span>
            </div>
            <span className="font-display font-bold text-lg text-white tracking-wide">УЧЁБА<span className="gradient-text">МАРКЕТ</span></span>
          </button>

          <div className="hidden md:flex items-center gap-8">
            {(["home","catalog","contacts","faq"] as Page[]).map(p => (
              <button key={p} onClick={() => nav(p)} className={`nav-link ${page === p ? "text-white" : ""}`}>
                {{ home: "Главная", catalog: "Каталог", contacts: "Контакты", faq: "FAQ" }[p]}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => nav("cart")} className="relative p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all">
              <Icon name="ShoppingCart" size={18} className="text-white/70" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-white" style={{ background: 'linear-gradient(135deg, #a855f7, #f472b6)' }}>
                  {cartItems.length}
                </span>
              )}
            </button>
            <button onClick={() => nav("profile")} className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white border border-white/10 bg-white/5 hover:bg-white/10 transition-all">
              <Icon name="User" size={15} />Кабинет
            </button>
            <button className="hidden sm:block px-4 py-2 rounded-xl text-sm font-bold text-white btn-glow" style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)' }}>
              Войти
            </button>
            <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden p-2 rounded-xl border border-white/10 bg-white/5">
              <Icon name={mobileMenu ? "X" : "Menu"} size={18} className="text-white" />
            </button>
          </div>
        </div>

        {mobileMenu && (
          <div className="md:hidden border-t border-white/5 bg-[#0a0916]/95 px-4 py-4 flex flex-col gap-2">
            {(["home","catalog","contacts","faq","profile"] as Page[]).map(p => (
              <button key={p} onClick={() => nav(p)} className="text-left px-3 py-2 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all text-sm font-medium">
                {{ home:"Главная", catalog:"Каталог", contacts:"Контакты", faq:"FAQ", profile:"Личный кабинет" }[p]}
              </button>
            ))}
            <button className="mt-1 px-4 py-2 rounded-xl text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)' }}>Войти</button>
          </div>
        )}
      </nav>

      <div className="pt-16">
        {page === "home" && <HomePage nav={nav} setActiveType={setActiveType} />}
        {page === "catalog" && <CatalogPage activeType={activeType} setActiveType={setActiveType} search={search} setSearch={setSearch} cartItems={cartItems} setCartItems={setCartItems} />}
        {page === "profile" && <ProfilePage nav={nav} cartItems={cartItems} />}
        {page === "cart" && <CartPage cartItems={cartItems} setCartItems={setCartItems} cartTotal={cartTotal} nav={nav} />}
        {page === "contacts" && <ContactsPage />}
        {page === "faq" && <FaqPage items={FAQ_ITEMS} openFaq={openFaq} setOpenFaq={setOpenFaq} />}
        {page === "success" && <SuccessPage nav={nav} paymentId={successPaymentId} setCartItems={setCartItems} />}
      </div>

      {/* FOOTER */}
      <footer className="border-t border-white/5 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #a855f7, #00d4ff)' }}>
                  <span className="text-white font-display font-bold text-sm">У</span>
                </div>
                <span className="font-display font-bold text-white">УЧЁБАМАРКЕТ</span>
              </div>
              <p className="text-white/40 text-sm leading-relaxed">Биржа учебных работ для школьников и студентов</p>
            </div>
            <div>
              <p className="font-display font-semibold text-white mb-3 text-sm tracking-wide uppercase">Разделы</p>
              {(["Главная","Каталог работ","Личный кабинет","Корзина"] as const).map(l => (
                <p key={l} className="text-white/40 text-sm mb-1.5 hover:text-white/70 cursor-pointer transition-colors">{l}</p>
              ))}
            </div>
            <div>
              <p className="font-display font-semibold text-white mb-3 text-sm tracking-wide uppercase">Поддержка</p>
              {["FAQ","Контакты","Возврат средств","Гарантии"].map(l => (
                <p key={l} className="text-white/40 text-sm mb-1.5 hover:text-white/70 cursor-pointer transition-colors">{l}</p>
              ))}
            </div>
            <div>
              <p className="font-display font-semibold text-white mb-3 text-sm tracking-wide uppercase">Контакты</p>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-white/40 text-sm"><Icon name="Mail" size={14} />info@uchyobamarket.ru</div>
                <div className="flex items-center gap-2 text-white/40 text-sm"><Icon name="MessageCircle" size={14} />Telegram: @uchyobabot</div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-xs">© 2026 УчёбаМаркет. Все права защищены.</p>
            <div className="flex gap-4">
              <span className="text-white/30 text-xs hover:text-white/50 cursor-pointer transition-colors">Политика конфиденциальности</span>
              <span className="text-white/30 text-xs hover:text-white/50 cursor-pointer transition-colors">Пользовательское соглашение</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function HomePage({ nav, setActiveType }: { nav: (p: Page) => void; setActiveType: (t: string) => void }) {
  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden mesh-bg">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="float-1 absolute top-20 right-[15%] w-64 h-64 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #a855f7, transparent 70%)' }} />
          <div className="float-2 absolute bottom-20 left-[10%] w-48 h-48 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #00d4ff, transparent 70%)' }} />
          <div className="float-3 absolute top-40 left-[5%] w-32 h-32 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #f472b6, transparent 70%)' }} />
          <div className="float-1 absolute top-32 right-[25%] text-4xl opacity-40 select-none">📚</div>
          <div className="float-2 absolute top-1/2 right-[30%] text-3xl opacity-30 select-none">🎓</div>
          <div className="float-3 absolute bottom-1/3 left-[20%] text-3xl opacity-30 select-none">✏️</div>
          <div className="float-4 absolute top-1/4 left-[30%] text-2xl opacity-25 select-none">💡</div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="animate-fade-in-up inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 mb-6">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm text-white/70 font-medium">8 000+ учебных работ</span>
              </div>
              <h1 className="animate-fade-in-up-delay-1 font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
                УЧИСЬ<br />
                <span className="gradient-text">УМНЕЕ.</span><br />
                СДАВАЙ<span className="gradient-text-pink"> ЛУЧШЕ.</span>
              </h1>
              <p className="animate-fade-in-up-delay-2 text-white/60 text-lg leading-relaxed mb-8 max-w-md">
                Маркетплейс готовых учебных работ для школьников и студентов. Курсовые, рефераты, дипломные — всё с гарантией качества.
              </p>
              <div className="animate-fade-in-up-delay-3 flex flex-col sm:flex-row gap-3 mb-10">
                <button onClick={() => nav("catalog")} className="px-8 py-4 rounded-2xl font-bold text-white text-base btn-glow" style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)' }}>
                  Перейти в каталог
                </button>
                <button onClick={() => nav("faq")} className="px-8 py-4 rounded-2xl font-medium text-white text-base border border-white/15 bg-white/5 hover:bg-white/10 transition-all">
                  Узнать о гарантиях
                </button>
              </div>
              <div className="animate-fade-in-up-delay-4 flex flex-wrap gap-2">
                {WORK_TYPES.slice(1).map(t => (
                  <button key={t} onClick={() => { setActiveType(t); nav("catalog"); }} className="tag-chip text-white/60 hover:text-white">
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="animate-fade-in-up-delay-3 hidden lg:flex justify-center relative">
              <div className="relative w-full max-w-lg">
                <div className="absolute inset-0 rounded-3xl blur-3xl opacity-30" style={{ background: 'linear-gradient(135deg, #a855f7, #00d4ff)' }} />
                <img src={HERO_IMAGE} alt="Учёба" className="relative rounded-3xl w-full object-cover shadow-2xl border border-white/10" style={{ aspectRatio: '1/1' }} />
                <div className="absolute -left-8 top-1/4 px-4 py-3 rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md">
                  <div className="flex items-center gap-2">
                    <Icon name="Star" size={16} className="text-yellow-400" />
                    <span className="text-white font-bold text-sm">4.9 рейтинг</span>
                  </div>
                  <p className="text-white/50 text-xs mt-0.5">12 000+ отзывов</p>
                </div>
                <div className="absolute -right-6 bottom-1/4 px-4 py-3 rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md">
                  <div className="flex items-center gap-2">
                    <Icon name="ShieldCheck" size={16} className="text-green-400" />
                    <span className="text-white font-bold text-sm">Гарантия</span>
                  </div>
                  <p className="text-white/50 text-xs mt-0.5">Возврат 14 дней</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-12 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: "FileText", value: "8 000+", label: "Работ в каталоге", color: "#a855f7" },
              { icon: "Users", value: "45 000+", label: "Студентов купили", color: "#00d4ff" },
              { icon: "Star", value: "4.9 / 5", label: "Средний рейтинг", color: "#f472b6" },
              { icon: "ShieldCheck", value: "100%", label: "Гарантия возврата", color: "#4ade80" },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl border border-white/5 bg-white/2">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" style={{ background: `${s.color}20` }}>
                  <Icon name={s.icon} size={22} style={{ color: s.color }} />
                </div>
                <p className="font-display text-2xl font-bold text-white">{s.value}</p>
                <p className="text-white/40 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SUBJECTS */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-neon-purple text-sm font-semibold uppercase tracking-widest mb-2">Предметы</p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white">НАЙДИ СВОЮ <span className="gradient-text">ДИСЦИПЛИНУ</span></h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {SUBJECTS.map((s, i) => (
              <button key={i} onClick={() => nav("catalog")} className="subject-card p-6 flex flex-col items-center text-center gap-3">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${s.color} shadow-lg`}>
                  <Icon name={s.icon} size={26} className="text-white" />
                </div>
                <div>
                  <p className="font-display font-semibold text-white text-sm tracking-wide">{s.label}</p>
                  <p className="text-white/40 text-xs mt-0.5">{s.count.toLocaleString()} работ</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR WORKS */}
      <section className="py-20 mesh-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-neon-cyan text-sm font-semibold uppercase tracking-widest mb-2">Популярное</p>
              <h2 className="font-display text-4xl font-bold text-white">ТОП <span className="gradient-text">РАБОТ</span></h2>
            </div>
            <button onClick={() => nav("catalog")} className="hidden sm:flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium transition-colors">
              Смотреть все <Icon name="ArrowRight" size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {WORKS.map(w => <WorkCard key={w.id} work={w} />)}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-neon-pink text-sm font-semibold uppercase tracking-widest mb-2">Просто</p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white">КАК ЭТО <span className="gradient-text-pink">РАБОТАЕТ</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: "01", icon: "Search", title: "Найди работу", desc: "Используй фильтры по предмету, типу работы и цене. Найди нужное за секунды.", color: "#a855f7" },
              { step: "02", icon: "CreditCard", title: "Оплати онлайн", desc: "Безопасная оплата картой, СБП или электронным кошельком. Мгновенное подтверждение.", color: "#00d4ff" },
              { step: "03", icon: "Download", title: "Скачай файл", desc: "Работа доступна сразу после оплаты в личном кабинете в форматах PDF и DOCX.", color: "#4ade80" },
            ].map((s, i) => (
              <div key={i} className="relative p-8 rounded-2xl border border-white/5 bg-white/2 overflow-hidden hover:border-white/10 transition-all">
                <div className="absolute top-4 right-4 font-display font-bold text-6xl text-white/3 select-none">{s.step}</div>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ background: `${s.color}20` }}>
                  <Icon name={s.icon} size={26} style={{ color: s.color }} />
                </div>
                <h3 className="font-display font-bold text-xl text-white mb-2">{s.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl p-10 sm:p-14 text-center" style={{ background: 'linear-gradient(135deg, #1a0933 0%, #0a1a2e 50%, #0d1f12 100%)' }}>
            <div className="absolute inset-0 mesh-bg opacity-60" />
            <div className="float-2 absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #a855f7, transparent 70%)' }} />
            <div className="float-3 absolute -bottom-10 -left-10 w-40 h-40 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #00d4ff, transparent 70%)' }} />
            <div className="relative">
              <p className="text-white/50 text-sm font-semibold uppercase tracking-widest mb-3">Начни сейчас</p>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">СКИДКА 15% НА<br /><span className="gradient-text">ПЕРВУЮ ПОКУПКУ</span></h2>
              <p className="text-white/50 mb-8 text-base">Зарегистрируйся и получи промокод на почту</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
                <input type="email" placeholder="Твой email" className="flex-1 px-5 py-3.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-purple-500/50" />
                <button className="px-6 py-3.5 rounded-xl font-bold text-white text-sm whitespace-nowrap btn-glow" style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)' }}>
                  Получить скидку
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function WorkCard({ work }: { work: typeof WORKS[0] }) {
  return (
    <div className="work-card p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex gap-2 flex-wrap">
          <span className="tag-chip text-neon-purple/80 text-[11px]">{work.subject}</span>
          <span className="tag-chip text-white/50 text-[11px]">{work.type}</span>
        </div>
        {work.badge === "hot" && <span className="badge-hot">🔥 ХИТ</span>}
        {work.badge === "new" && <span className="badge-new">✨ НОВОЕ</span>}
      </div>
      <h3 className="font-display font-semibold text-white text-sm leading-snug mb-4 line-clamp-2">{work.title}</h3>
      <div className="flex items-center gap-3 text-white/40 text-xs mb-4">
        <div className="flex items-center gap-1"><Icon name="Star" size={12} className="text-yellow-400" />{work.rating}</div>
        <div className="flex items-center gap-1"><Icon name="MessageSquare" size={12} />{work.reviews} отзывов</div>
        <div className="flex items-center gap-1"><Icon name="FileText" size={12} />{work.pages} стр.</div>
      </div>
      <div className="flex items-center justify-between">
        <span className="font-display font-bold text-xl text-white">{work.price} ₽</span>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white btn-cyan-glow" style={{ background: 'linear-gradient(135deg, #0ea5e9, #00d4ff)', color: '#fff' }}>
          <Icon name="ShoppingCart" size={13} />В корзину
        </button>
      </div>
    </div>
  );
}

function CatalogPage({ activeType, setActiveType, search, setSearch, cartItems, setCartItems }: {
  activeType: string; setActiveType: (t: string) => void;
  search: string; setSearch: (s: string) => void;
  cartItems: typeof CART_DEFAULT; setCartItems: (items: typeof CART_DEFAULT) => void;
}) {
  const [activeSubject, setActiveSubject] = useState("Все предметы");
  const [sortBy, setSortBy] = useState("popular");

  const subjects = ["Все предметы", ...SUBJECTS.map(s => s.label)];

  const filteredWorks = WORKS.filter(w => {
    const matchType = activeType === "Все работы" || w.type === activeType;
    const matchSubject = activeSubject === "Все предметы" || w.subject === activeSubject;
    const matchSearch = !search || w.title.toLowerCase().includes(search.toLowerCase()) || w.subject.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSubject && matchSearch;
  });

  const addToCart = (work: typeof WORKS[0]) => {
    if (!cartItems.find(i => i.id === work.id)) {
      setCartItems([...cartItems, { id: work.id, title: work.title, subject: work.subject, price: work.price }]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-white mb-2">КАТАЛОГ <span className="gradient-text">РАБОТ</span></h1>
        <p className="text-white/40">Найди нужную работу среди 8 000+ материалов</p>
      </div>

      <div className="relative mb-6">
        <Icon name="Search" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Поиск по названию или предмету..."
          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-purple-500/50" />
      </div>

      <div className="flex gap-6">
        <div className="hidden lg:block w-56 flex-shrink-0">
          <div className="rounded-2xl border border-white/7 bg-white/3 p-5 sticky top-24">
            <p className="font-display font-semibold text-white text-sm mb-4 uppercase tracking-wide">Предметы</p>
            <div className="flex flex-col gap-1">
              {subjects.map(s => (
                <button key={s} onClick={() => setActiveSubject(s)}
                  className={`text-left px-3 py-2 rounded-xl text-sm transition-all ${activeSubject === s ? "bg-purple-500/20 text-purple-300 font-medium" : "text-white/50 hover:text-white hover:bg-white/5"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide pb-1">
            {WORK_TYPES.map(t => (
              <button key={t} onClick={() => setActiveType(t)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeType === t ? "text-white border-purple-500/50 border" : "text-white/50 border border-white/10 hover:border-white/20 hover:text-white"}`}
                style={activeType === t ? { background: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(124,58,237,0.2))' } : {}}>
                {t}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mb-5">
            <p className="text-white/40 text-sm"><span className="text-white font-medium">{filteredWorks.length}</span> работ найдено</p>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none cursor-pointer">
              <option value="popular">По популярности</option>
              <option value="price-asc">Сначала дешевле</option>
              <option value="price-desc">Сначала дороже</option>
              <option value="rating">По рейтингу</option>
            </select>
          </div>

          {filteredWorks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredWorks.map(w => (
                <div key={w.id} className="work-card p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex gap-2 flex-wrap">
                      <span className="tag-chip text-neon-purple/80 text-[11px]">{w.subject}</span>
                      <span className="tag-chip text-white/50 text-[11px]">{w.type}</span>
                    </div>
                    {w.badge === "hot" && <span className="badge-hot">🔥 ХИТ</span>}
                    {w.badge === "new" && <span className="badge-new">✨ НОВОЕ</span>}
                  </div>
                  <h3 className="font-display font-semibold text-white text-sm leading-snug mb-4 line-clamp-2">{w.title}</h3>
                  <div className="flex items-center gap-3 text-white/40 text-xs mb-4">
                    <div className="flex items-center gap-1"><Icon name="Star" size={12} className="text-yellow-400" />{w.rating}</div>
                    <div className="flex items-center gap-1"><Icon name="MessageSquare" size={12} />{w.reviews}</div>
                    <div className="flex items-center gap-1"><Icon name="FileText" size={12} />{w.pages} стр.</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-xl text-white">{w.price} ₽</span>
                    <button onClick={() => addToCart(w)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${cartItems.find(i => i.id === w.id) ? "text-green-400 border border-green-500/30 bg-green-500/10" : "text-white btn-cyan-glow"}`}
                      style={!cartItems.find(i => i.id === w.id) ? { background: 'linear-gradient(135deg, #0ea5e9, #00d4ff)' } : {}}>
                      <Icon name={cartItems.find(i => i.id === w.id) ? "Check" : "ShoppingCart"} size={13} />
                      {cartItems.find(i => i.id === w.id) ? "В корзине" : "В корзину"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-white/30">
              <Icon name="SearchX" size={40} className="mx-auto mb-4 opacity-50" />
              <p className="font-display text-xl">Ничего не найдено</p>
              <p className="text-sm mt-2">Попробуй изменить фильтры</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProfilePage({ nav, cartItems }: { nav: (p: Page) => void; cartItems: typeof CART_DEFAULT }) {
  const [activeTab, setActiveTab] = useState("purchases");
  const tabs = [
    { id: "purchases", label: "Покупки", icon: "ShoppingBag" },
    { id: "favorites", label: "Избранное", icon: "Heart" },
    { id: "settings", label: "Настройки", icon: "Settings" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="rounded-3xl overflow-hidden border border-white/7" style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.06), rgba(0,212,255,0.03))' }}>
        <div className="relative h-32 overflow-hidden">
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #2d0a52, #0a1a3d)' }} />
          <div className="float-1 absolute top-0 right-0 w-48 h-48 rounded-full opacity-30" style={{ background: 'radial-gradient(circle, #a855f7, transparent 70%)' }} />
        </div>
        <div className="px-6 sm:px-8 pb-8">
          <div className="flex items-end gap-4 -mt-12 mb-6">
            <div className="w-20 h-20 rounded-2xl border-4 border-background flex items-center justify-center font-display font-bold text-2xl text-white" style={{ background: 'linear-gradient(135deg, #a855f7, #00d4ff)' }}>
              А
            </div>
            <div className="mb-2">
              <h2 className="font-display text-2xl font-bold text-white">Алексей Смирнов</h2>
              <p className="text-white/40 text-sm">a.smirnov@example.com</p>
            </div>
            <div className="ml-auto mb-2 hidden sm:block">
              <div className="px-4 py-2 rounded-xl border border-purple-500/30 bg-purple-500/10">
                <p className="text-purple-300 text-xs font-semibold">Бонусных баллов</p>
                <p className="font-display font-bold text-xl text-white">1 240</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2 border-b border-white/5 mb-6">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all ${activeTab === t.id ? "border-purple-500 text-white" : "border-transparent text-white/40 hover:text-white/70"}`}>
                <Icon name={t.icon} size={15} />{t.label}
              </button>
            ))}
          </div>

          {activeTab === "purchases" && (
            <div className="space-y-3">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.3), rgba(124,58,237,0.3))' }}>
                      <Icon name="FileText" size={18} className="text-purple-300" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{item.title}</p>
                      <p className="text-white/40 text-xs">{item.subject} • {item.price} ₽</p>
                    </div>
                  </div>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all" style={{ color: '#00d4ff', borderColor: 'rgba(0,212,255,0.3)', background: 'rgba(0,212,255,0.05)' }}>
                    <Icon name="Download" size={13} />Скачать
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === "favorites" && (
            <div className="text-center py-12 text-white/30">
              <Icon name="Heart" size={40} className="mx-auto mb-4 opacity-50" />
              <p className="font-display text-xl">Нет избранных работ</p>
              <p className="text-sm mt-2 mb-6">Добавляй работы в избранное</p>
              <button onClick={() => nav("catalog")} className="px-6 py-3 rounded-xl font-bold text-white btn-glow" style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)' }}>
                Перейти в каталог
              </button>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-4 max-w-lg">
              {["Имя", "Email", "Номер телефона"].map((f, i) => (
                <div key={i}>
                  <label className="text-white/50 text-xs font-medium mb-1.5 block">{f}</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50" placeholder={f} />
                </div>
              ))}
              <button className="px-6 py-3 rounded-xl font-bold text-white text-sm btn-glow" style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)' }}>
                Сохранить изменения
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const PAYMENT_URL = "https://functions.poehali.dev/4bdff667-0a64-46e2-8e9c-68cd78ea6c76";

function CartPage({ cartItems, setCartItems, cartTotal, nav }: {
  cartItems: typeof CART_DEFAULT; setCartItems: (items: typeof CART_DEFAULT) => void;
  cartTotal: number; nav: (p: Page) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [promo, setPromo] = useState("");
  const removeItem = (id: number) => setCartItems(cartItems.filter(i => i.id !== id));

  const handlePay = async () => {
    setLoading(true);
    setError("");
    try {
      const description = cartItems.map(i => i.title).join(", ").slice(0, 128);
      const res = await fetch(PAYMENT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: cartTotal,
          description: `УчёбаМаркет: ${description}`,
          return_url: `${window.location.origin}${window.location.pathname}?payment=success`,
          items: cartItems.map(i => ({ id: i.id, title: i.title, price: i.price })),
        }),
      });
      const data = await res.json();
      if (data.confirmation_url) {
        // Сохраняем payment_id — подхватим после возврата с ЮKassa
        if (data.payment_id) {
          sessionStorage.setItem('ym_payment_id', data.payment_id);
        }
        window.location.href = data.confirmation_url;
      } else {
        setError(data.error || "Не удалось создать платёж. Попробуй позже.");
      }
    } catch {
      setError("Ошибка соединения. Проверь интернет и попробуй снова.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-4xl font-bold text-white mb-2">КОРЗИНА <span className="gradient-text">ПОКУПОК</span></h1>
      <p className="text-white/40 mb-8">{cartItems.length} {cartItems.length === 1 ? "работа" : "работы"} выбрано</p>

      {cartItems.length === 0 ? (
        <div className="text-center py-24 text-white/30">
          <Icon name="ShoppingCart" size={48} className="mx-auto mb-4 opacity-50" />
          <p className="font-display text-2xl mb-2">Корзина пуста</p>
          <p className="text-sm mb-8">Добавляй работы из каталога</p>
          <button onClick={() => nav("catalog")} className="px-8 py-4 rounded-2xl font-bold text-white btn-glow" style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)' }}>
            Перейти в каталог
          </button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-3">
            {cartItems.map(item => (
              <div key={item.id} className="work-card p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.25), rgba(0,212,255,0.15))' }}>
                  <Icon name="FileText" size={22} className="text-purple-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm line-clamp-1">{item.title}</p>
                  <p className="text-white/40 text-xs mt-0.5">{item.subject}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-display font-bold text-lg text-white whitespace-nowrap">{item.price} ₽</span>
                  <button onClick={() => removeItem(item.id)} className="p-2 rounded-xl text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all">
                    <Icon name="Trash2" size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:w-72 flex-shrink-0">
            <div className="rounded-2xl border border-white/7 bg-white/3 p-6 sticky top-24">
              <h3 className="font-display font-bold text-white text-lg mb-5">ИТОГО</h3>
              <div className="space-y-3 mb-5">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-white/50 truncate mr-2 flex-1">{item.title.slice(0, 28)}...</span>
                    <span className="text-white whitespace-nowrap">{item.price} ₽</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/10 pt-4 mb-5">
                <div className="flex justify-between items-center">
                  <span className="text-white/70 font-medium">Итого:</span>
                  <span className="font-display font-bold text-2xl text-white">{cartTotal} ₽</span>
                </div>
              </div>

              <input
                type="text" value={promo} onChange={e => setPromo(e.target.value)}
                placeholder="Промокод"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-purple-500/50 mb-4"
              />

              {/* Payment methods info */}
              <div className="rounded-xl border border-white/7 bg-white/3 p-4 mb-4">
                <p className="text-white/50 text-xs font-semibold mb-3 uppercase tracking-wide">Способы оплаты</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { icon: "CreditCard", label: "Карта" },
                    { icon: "Smartphone", label: "СБП" },
                    { icon: "Wallet", label: "Кошелёк" },
                  ].map((m) => (
                    <div key={m.label} className="flex flex-col items-center gap-1 py-2 rounded-xl bg-white/5">
                      <Icon name={m.icon} size={16} className="text-white/50" />
                      <span className="text-white/40 text-[10px]">{m.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 mb-4">
                  <p className="text-red-400 text-xs leading-relaxed">{error}</p>
                </div>
              )}

              <button
                onClick={handlePay}
                disabled={loading}
                className="w-full py-4 rounded-2xl font-bold text-white text-base btn-glow mb-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
                style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)' }}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Создаём платёж...
                  </>
                ) : (
                  <>
                    <Icon name="Lock" size={15} />
                    Оплатить {cartTotal} ₽
                  </>
                )}
              </button>
              <p className="text-center text-white/25 text-[11px]">Безопасная оплата через ЮKassa</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ContactsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-12">
        <h1 className="font-display text-4xl font-bold text-white mb-2">КОНТАКТЫ <span className="gradient-text">И ПОДДЕРЖКА</span></h1>
        <p className="text-white/40">Мы всегда готовы помочь — выбери удобный способ связи</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
        {[
          { icon: "MessageCircle", title: "Telegram", desc: "Ответим за 5 минут", value: "@uchyobabot", color: "#00d4ff", action: "Написать" },
          { icon: "Mail", title: "Email", desc: "Ответим в течение часа", value: "info@uchyobamarket.ru", color: "#a855f7", action: "Написать" },
          { icon: "Phone", title: "Телефон", desc: "Пн–Пт, 9:00–20:00", value: "+7 (800) 555-0199", color: "#4ade80", action: "Позвонить" },
        ].map((c, i) => (
          <div key={i} className="card-glow rounded-2xl border border-white/7 bg-white/3 p-6 flex flex-col">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: `${c.color}20` }}>
              <Icon name={c.icon} size={22} style={{ color: c.color }} />
            </div>
            <h3 className="font-display font-bold text-white text-lg mb-1">{c.title}</h3>
            <p className="text-white/40 text-xs mb-2">{c.desc}</p>
            <p className="text-white/70 text-sm font-medium mb-4">{c.value}</p>
            <button className="mt-auto px-4 py-2.5 rounded-xl text-sm font-bold transition-all" style={{ background: `${c.color}15`, border: `1px solid ${c.color}40`, color: c.color }}>
              {c.action}
            </button>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-white/7 bg-white/3 p-8">
          <h2 className="font-display font-bold text-white text-2xl mb-6">НАПИСАТЬ НАМ</h2>
          <div className="space-y-4">
            {[["Имя", "text", "Твоё имя"], ["Email", "email", "Email"], ["Сообщение", "textarea", "Опиши вопрос..."]].map(([label, type, ph], i) => (
              <div key={i}>
                <label className="text-white/50 text-xs font-medium mb-1.5 block">{label}</label>
                {type === "textarea"
                  ? <textarea rows={4} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50 resize-none" placeholder={ph} />
                  : <input type={type} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50" placeholder={ph} />
                }
              </div>
            ))}
            <button className="w-full py-3.5 rounded-xl font-bold text-white text-sm btn-glow" style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)' }}>
              Отправить сообщение
            </button>
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/7 bg-white/3 p-6">
            <h3 className="font-display font-bold text-white mb-4 text-sm uppercase tracking-wide">Часы работы</h3>
            {[{ day: "Пн — Пт", time: "9:00 — 20:00", active: true }, { day: "Суббота", time: "10:00 — 18:00", active: true }, { day: "Воскресенье", time: "Выходной", active: false }].map((row, i) => (
              <div key={i} className="flex justify-between items-center py-2.5 border-b border-white/5 last:border-0">
                <span className="text-white/60 text-sm">{row.day}</span>
                <span className={`text-sm font-medium ${row.active ? "text-green-400" : "text-white/30"}`}>{row.time}</span>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
              <p className="font-display font-bold text-green-400 text-sm">ОНЛАЙН ПРЯМО СЕЙЧАС</p>
            </div>
            <p className="text-white/60 text-sm">Среднее время ответа: <span className="text-white font-medium">менее 5 минут</span></p>
          </div>
          <div className="rounded-2xl border border-white/7 bg-white/3 p-6">
            <h3 className="font-display font-bold text-white mb-3 text-sm uppercase tracking-wide">Гарантии</h3>
            {["Возврат средств в течение 14 дней", "Оригинальность работ от 70%", "Файлы доступны сразу после оплаты", "Поддержка 7 дней в неделю"].map((g, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-white/60 py-1">
                <Icon name="Check" size={14} className="text-green-400 flex-shrink-0" />{g}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FaqPage({ items, openFaq, setOpenFaq }: { items: typeof FAQ_ITEMS; openFaq: number | null; setOpenFaq: (n: number | null) => void }) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-3">
          ЧАСТО <span className="gradient-text">ЗАДАВАЕМЫЕ</span><br />ВОПРОСЫ
        </h1>
        <p className="text-white/40">Нашли ответы на самые популярные вопросы</p>
      </div>
      <div className="space-y-3 mb-14">
        {items.map((item, i) => (
          <div key={i} className={`rounded-2xl border transition-all duration-200 overflow-hidden ${openFaq === i ? "border-purple-500/40 bg-purple-500/5" : "border-white/7 bg-white/3 hover:border-white/12"}`}>
            <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between px-6 py-5 text-left">
              <span className="font-display font-semibold text-white text-base pr-4">{item.q}</span>
              <div className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center transition-all duration-200 ${openFaq === i ? "rotate-45" : ""}`}
                style={{ background: openFaq === i ? 'linear-gradient(135deg, #a855f7, #7c3aed)' : 'rgba(255,255,255,0.05)' }}>
                <Icon name="Plus" size={16} className="text-white" />
              </div>
            </button>
            {openFaq === i && (
              <div className="px-6 pb-5">
                <p className="text-white/60 text-sm leading-relaxed">{item.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="rounded-3xl overflow-hidden p-8 text-center relative" style={{ background: 'linear-gradient(135deg, #1a0933, #0a1a2e)' }}>
        <div className="float-2 absolute -top-8 right-0 w-32 h-32 rounded-full opacity-25" style={{ background: 'radial-gradient(circle, #a855f7, transparent 70%)' }} />
        <div className="relative">
          <h2 className="font-display text-3xl font-bold text-white mb-2">НЕ НАШЁЛ ОТВЕТ?</h2>
          <p className="text-white/50 text-sm mb-6">Напиши нам — ответим за 5 минут</p>
          <button className="px-8 py-3.5 rounded-2xl font-bold text-white btn-glow" style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)' }}>
            Написать в поддержку
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Страница успешной оплаты ────────────────────────────────────────────────

type OrderItem = { id: number; title: string; price: number; subject?: string };
type Order = {
  payment_id: string;
  status: string;
  amount: number;
  items: OrderItem[];
  paid_at: string | null;
};

function SuccessPage({ nav, paymentId, setCartItems }: {
  nav: (p: Page) => void;
  paymentId: string | null;
  setCartItems: (items: typeof CART_DEFAULT) => void;
}) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [pollCount, setPollCount] = useState(0);

  useEffect(() => {
    if (!paymentId || paymentId === 'unknown') {
      setLoadingOrder(false);
      return;
    }

    let attempts = 0;
    const maxAttempts = 8;

    const poll = async () => {
      attempts++;
      setPollCount(attempts);
      try {
        const res = await fetch(`${GET_ORDER_URL}?payment_id=${paymentId}`);
        const data = await res.json();
        if (data.status === 'paid' || data.status === 'succeeded') {
          setOrder(data);
          setLoadingOrder(false);
          setCartItems([]);
          return;
        }
        if (attempts < maxAttempts) {
          setTimeout(poll, 2000);
        } else {
          setOrder(data);
          setLoadingOrder(false);
        }
      } catch {
        if (attempts < maxAttempts) setTimeout(poll, 2000);
        else setLoadingOrder(false);
      }
    };

    poll();
  }, [paymentId]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full">
        {loadingOrder ? (
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 rounded-full opacity-20 animate-pulse" style={{ background: 'radial-gradient(circle, #a855f7, transparent)' }} />
              <div className="w-24 h-24 rounded-full border-4 border-white/10 border-t-purple-500 animate-spin" />
              <Icon name="CreditCard" size={32} className="text-purple-400 absolute inset-0 m-auto" />
            </div>
            <h1 className="font-display text-3xl font-bold text-white mb-3">ОБРАБАТЫВАЕМ ПЛАТЁЖ</h1>
            <p className="text-white/50 text-sm">
              Подтверждаем оплату{pollCount > 1 ? ` (попытка ${pollCount})` : ''}...
            </p>
            <div className="flex justify-center gap-1 mt-4">
              {[0,1,2].map(i => (
                <div key={i} className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-fade-in-up">
            <div className="relative w-28 h-28 mx-auto mb-8">
              <div className="absolute inset-0 rounded-full blur-2xl opacity-40" style={{ background: 'radial-gradient(circle, #4ade80, transparent)' }} />
              <div className="w-28 h-28 rounded-full flex items-center justify-center relative" style={{ background: 'linear-gradient(135deg, rgba(74,222,128,0.2), rgba(16,185,129,0.2))', border: '2px solid rgba(74,222,128,0.4)' }}>
                <Icon name="CheckCircle" size={52} className="text-green-400" />
              </div>
            </div>

            <div className="text-center mb-8">
              <h1 className="font-display text-4xl font-bold text-white mb-3">
                ОПЛАТА <span className="text-green-400">ПРОШЛА!</span>
              </h1>
              <p className="text-white/50 text-base">
                {order?.status === 'paid'
                  ? 'Работы куплены и доступны для скачивания'
                  : 'Платёж принят — доступ будет открыт через несколько секунд'}
              </p>
            </div>

            {order && order.items && order.items.length > 0 && (
              <div className="rounded-2xl border border-white/7 bg-white/3 p-5 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-display font-semibold text-white text-sm uppercase tracking-wide">Купленные работы</p>
                  <span className="text-white/40 text-xs">{order.items.length} {order.items.length === 1 ? 'работа' : 'работы'}</span>
                </div>
                <div className="space-y-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/5">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.3), rgba(0,212,255,0.2))' }}>
                          <Icon name="FileText" size={16} className="text-purple-300" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-white text-xs font-medium line-clamp-1">{item.title}</p>
                          <p className="text-white/40 text-[11px] mt-0.5">{item.price} ₽</p>
                        </div>
                      </div>
                      <button
                        className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                        style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)', color: '#00d4ff' }}
                      >
                        <Icon name="Download" size={12} />
                        Скачать
                      </button>
                    </div>
                  ))}
                </div>
                {order.amount && (
                  <div className="border-t border-white/5 mt-4 pt-4 flex justify-between items-center">
                    <span className="text-white/50 text-sm">Итого оплачено:</span>
                    <span className="font-display font-bold text-white text-lg">{order.amount} ₽</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={() => nav('profile')}
                className="w-full py-4 rounded-2xl font-bold text-white text-base btn-glow flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)' }}
              >
                <Icon name="User" size={18} />
                Перейти в личный кабинет
              </button>
              <button
                onClick={() => nav('catalog')}
                className="w-full py-3.5 rounded-2xl font-medium text-white/70 text-sm border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
              >
                Продолжить покупки
              </button>
            </div>

            <div className="mt-6 rounded-xl border border-green-500/20 bg-green-500/5 p-4 flex items-start gap-3">
              <Icon name="Mail" size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-white/50 text-xs leading-relaxed">
                Копия чека отправлена на твою почту. Все работы доступны в{' '}
                <button onClick={() => nav('profile')} className="text-neon-cyan underline">личном кабинете</button>.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}