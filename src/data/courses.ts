// Learning path data
export const learningPath = [
  {
    id: "level-1",
    slug: "fundamentals",
    phase: "المستوى الأول: المبادئ الأساسية",
    completed: false,
    current: true,
    level: 1,
    months: "1-2",
    courses: ["1-1", "1-2", "1-3"],
    description: "تعلم أساسيات الشبكات، نظام لينكس، والمفاهيم الأساسية للأمن المعلوماتي",
    locked: false,
    progress: 65,
    learningOutcomes: [
      "فهم المفاهيم الأساسية للشبكات وبروتوكولات الاتصال",
      "التعرف على أساسيات نظام التشغيل Linux وأوامره الرئيسية",
      "تعلم مبادئ الأمن السيبراني والتهديدات الشائعة",
      "تطبيق المفاهيم النظرية في بيئة عملية آمنة",
      "إتقان استخدام الأدوات الأساسية في مجال الأمن السيبراني"
    ]
  },
  {
    id: "level-2",
    slug: "intermediate",
    phase: "المستوى الثاني: المواضيع المتوسطة",
    completed: false,
    current: false,
    level: 2,
    months: "3-4",
    courses: ["2-1", "2-2", "2-3"],
    description: "اختبار تطبيقات الويب، تحليل الثغرات الأمنية، واستغلال الأخطاء الشائعة في الإعدادات",
    locked: false,
    progress: 0,
    learningOutcomes: [
      "تحليل وتقييم أمان تطبيقات الويب",
      "اكتشاف وتوثيق الثغرات الأمنية",
      "فهم واستغلال الأخطاء الشائعة في الإعدادات",
      "استخدام أدوات اختبار الاختراق المتقدمة",
      "تطوير استراتيجيات الحماية والتخفيف من المخاطر"
    ]
  },
  {
    id: "level-3",
    slug: "advanced",
    phase: "المستوى الثالث: المواضيع المتقدمة",
    completed: false,
    current: false,
    level: 3,
    months: "5-6",
    courses: ["3-1", "3-2", "3-3"],
    description: "تصعيد الصلاحيات، استغلال الشبكات، واختراق Active Directory",
    locked: false,
    progress: 0,
    learningOutcomes: [
      "إتقان تقنيات تصعيد الصلاحيات في الأنظمة المختلفة",
      "تحليل وتنفيذ هجمات متقدمة على الشبكات",
      "فهم وتطبيق تقنيات اختراق Active Directory",
      "تطوير حلول أمنية متقدمة للمؤسسات",
      "تنفيذ عمليات اختبار اختراق شاملة"
    ]
  },
  {
    id: "final",
    slug: "certification",
    phase: "الامتحان النهائي والشهادة",
    completed: false,
    current: false,
    level: 4,
    months: "نهاية البرنامج",
    courses: ["final-1"],
    description: "اختبار شامل لجميع المهارات المكتسبة للحصول على شهادة CyberMentor",
    locked: false,
    progress: 0,
    learningOutcomes: [
      "تطبيق جميع المهارات المكتسبة في مشروع عملي",
      "إجراء اختبار اختراق شامل في بيئة واقعية",
      "توثيق وتقديم تقارير احترافية",
      "الحصول على شهادة CyberMentor المعتمدة",
      "إثبات الكفاءة في جميع جوانب الأمن السيبراني"
    ]
  }
];

// Course data
export const coursesData = [
  // Level 1: Fundamentals
  {
    id: "1-1",
    slug: "network-basics",
    title: "أساسيات الشبكات",
    description: "تعلم المفاهيم الأساسية للشبكات وبروتوكولات الاتصال",
    duration: "3 أسابيع",
    level: "Beginner" as const,
    enrolledStudents: 245,
    progress: 85,
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=300&h=300",
    certified: true,
    phaseId: "level-1",
    content: [
      {
        id: "section-1",
        title: "مقدمة في الشبكات",
        items: [
          {
            id: "1-1-1",
            title: "مقدمة عن الشبكات والبروتوكولات",
            duration: "10min",
            type: "video",
            completed: true,
            locked: false,
            description: "تعلم المفاهيم الأساسية للشبكات وكيفية عملها",
            writtenContent: `
# مقدمة في الشبكات والبروتوكولات

## المفاهيم الأساسية
- تعريف الشبكة: مجموعة من الأجهزة المتصلة ببعضها البعض
- أنواع الشبكات: LAN, WAN, MAN
- مكونات الشبكة الأساسية

## البروتوكولات الشائعة
- TCP/IP
- HTTP/HTTPS
- DNS
- DHCP

## أمن الشبكات
- أهمية حماية الشبكات
- التهديدات الشائعة
- طرق الحماية الأساسية
`
          },
          {
            id: "1-1-2",
            title: "نموذج OSI",
            duration: "15min",
            type: "text",
            completed: true,
            locked: false,
            description: "فهم طبقات نموذج OSI وكيفية تفاعلها"
          },
          {
            id: "1-1-3",
            title: "[LAB] تحليل حزم البيانات",
            duration: "30min",
            type: "lab",
            completed: true,
            locked: false,
            description: "تطبيق عملي على تحليل حزم البيانات باستخدام Wireshark"
          }
        ]
      },
      {
        id: "section-2",
        title: "بروتوكولات TCP/IP",
        items: [
          {
            id: "1-1-4",
            title: "مقدمة في TCP/IP",
            duration: "12min",
            type: "video",
            completed: true,
            locked: false,
            description: "فهم أساسيات بروتوكول TCP/IP وكيفية عمله"
          },
          {
            id: "1-1-5",
            title: "تحليل المنافذ والخدمات",
            duration: "20min",
            type: "text",
            completed: false,
            locked: false,
            description: "تعلم كيفية تحليل المنافذ المفتوحة والخدمات المشغلة"
          }
        ]
      }
    ]
  },
  {
    id: "1-2",
    slug: "linux-essentials",
    title: "نظام لينكس",
    description: "تعلم أساسيات نظام التشغيل Linux وأوامره الأساسية",
    duration: "4 أسابيع",
    level: "Beginner" as const,
    enrolledStudents: 230,
    progress: 60,
    image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=300&h=300",
    certified: true,
    phaseId: "level-1",
    content: [
      {
        id: "section-1",
        title: "مقدمة في نظام لينكس",
        items: [
          {
            id: "1-2-1",
            title: "مقدمة عن نظام لينكس وتاريخه",
            duration: "15min",
            type: "video",
            completed: true,
            locked: false,
            description: "تعرف على تاريخ نظام لينكس وأهميته في مجال الأمن السيبراني"
          },
          {
            id: "1-2-2",
            title: "تثبيت نظام لينكس",
            duration: "30min",
            type: "lab",
            completed: false,
            locked: false,
            description: "خطوات تثبيت نظام لينكس وإعداده للاستخدام"
          }
        ]
      }
    ]
  },
  {
    id: "1-3",
    slug: "cybersecurity-intro",
    title: "مقدمة في الأمن السيبراني",
    description: "فهم المفاهيم الأساسية للأمن السيبراني والتهديدات الشائعة",
    duration: "3 أسابيع",
    level: "Beginner" as const,
    enrolledStudents: 210,
    progress: 50,
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=300&h=300",
    certified: true,
    phaseId: "level-1",
    content: [
      {
        id: "section-1",
        title: "أساسيات الأمن السيبراني",
        items: [
          {
            id: "1-3-1",
            title: "مقدمة في الأمن السيبراني",
            duration: "20min",
            type: "video",
            completed: true,
            locked: false,
            description: "تعرف على المفاهيم الأساسية للأمن السيبراني"
          }
        ]
      }
    ]
  },

  // Level 2: Intermediate
  {
    id: "2-1",
    slug: "web-application-security",
    title: "أمن تطبيقات الويب",
    description: "تعلم كيفية اختبار واكتشاف الثغرات في تطبيقات الويب",
    duration: "4 أسابيع",
    level: "Intermediate" as const,
    enrolledStudents: 180,
    progress: 0,
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=300&h=300",
    certified: true,
    phaseId: "level-2",
    content: [
      {
        id: "section-1",
        title: "مقدمة في أمن تطبيقات الويب",
        items: [
          {
            id: "2-1-1",
            title: "مفاهيم أساسية في أمن تطبيقات الويب",
            duration: "25min",
            type: "video",
            completed: false,
            locked: false,
            description: "تعرف على المفاهيم الأساسية في أمن تطبيقات الويب",
            writtenContent: `
# مقدمة في أمن تطبيقات الويب

## المفاهيم الأساسية
- ما هي تطبيقات الويب
- التهديدات الشائعة
- OWASP Top 10

## أدوات الاختبار
- Burp Suite
- OWASP ZAP
- Browser Developer Tools

## منهجية الاختبار
- Black Box Testing
- White Box Testing
- Gray Box Testing
`
          },
          {
            id: "2-1-2",
            title: "اكتشاف الثغرات الشائعة",
            duration: "45min",
            type: "lab",
            completed: false,
            locked: false,
            description: "تطبيق عملي على اكتشاف الثغرات الشائعة في تطبيقات الويب"
          }
        ]
      }
    ]
  },
  {
    id: "2-2",
    slug: "network-pentesting",
    title: "اختبار اختراق الشبكات",
    description: "تعلم منهجيات وأدوات اختبار اختراق الشبكات",
    duration: "5 أسابيع",
    level: "Intermediate" as const,
    enrolledStudents: 165,
    progress: 0,
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=300&h=300",
    certified: true,
    phaseId: "level-2",
    content: [
      {
        id: "section-1",
        title: "أساسيات اختبار الاختراق",
        items: [
          {
            id: "2-2-1",
            title: "مقدمة في اختبار الاختراق",
            duration: "30min",
            type: "video",
            completed: false,
            locked: false,
            description: "تعرف على مفاهيم وأساسيات اختبار الاختراق"
          }
        ]
      }
    ]
  },
  {
    id: "2-3",
    slug: "wireless-security",
    title: "أمن الشبكات اللاسلكية",
    description: "تعلم كيفية اختبار وتأمين الشبكات اللاسلكية",
    duration: "3 أسابيع",
    level: "Intermediate" as const,
    enrolledStudents: 150,
    progress: 0,
    image: "https://images.unsplash.com/photo-1562813733-b31f71025d54?auto=format&fit=crop&w=300&h=300",
    certified: true,
    phaseId: "level-2",
    content: [
      {
        id: "section-1",
        title: "أساسيات الشبكات اللاسلكية",
        items: [
          {
            id: "2-3-1",
            title: "مقدمة في أمن الشبكات اللاسلكية",
            duration: "20min",
            type: "video",
            completed: false,
            locked: false,
            description: "تعرف على أساسيات أمن الشبكات اللاسلكية"
          }
        ]
      }
    ]
  },

  // Level 3: Advanced
  {
    id: "3-1",
    slug: "malware-analysis",
    title: "تحليل البرمجيات الخبيثة",
    description: "تعلم تقنيات تحليل وتفكيك البرمجيات الخبيثة",
    duration: "6 أسابيع",
    level: "Advanced" as const,
    enrolledStudents: 120,
    progress: 0,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=300&h=300",
    certified: true,
    phaseId: "level-3",
    content: [
      {
        id: "section-1",
        title: "مقدمة في تحليل البرمجيات الخبيثة",
        items: [
          {
            id: "3-1-1",
            title: "أساسيات تحليل البرمجيات الخبيثة",
            duration: "35min",
            type: "video",
            completed: false,
            locked: false,
            description: "تعرف على المفاهيم الأساسية في تحليل البرمجيات الخبيثة",
            writtenContent: `
# مقدمة في تحليل البرمجيات الخبيثة

## المفاهيم الأساسية
- أنواع البرمجيات الخبيثة
- بيئة التحليل الآمنة
- أدوات التحليل

## منهجيات التحليل
- التحليل الثابت
- التحليل الديناميكي
- الهندسة العكسية

## أدوات التحليل
- IDA Pro
- Ghidra
- x64dbg
`
          },
          {
            id: "3-1-2",
            title: "إعداد بيئة التحليل",
            duration: "45min",
            type: "lab",
            completed: false,
            locked: false,
            description: "تطبيق عملي على إعداد بيئة تحليل آمنة"
          }
        ]
      }
    ]
  },
  {
    id: "3-2",
    slug: "exploit-development",
    title: "تطوير الثغرات",
    description: "تعلم كيفية اكتشاف وتطوير واستغلال الثغرات البرمجية",
    duration: "8 أسابيع",
    level: "Advanced" as const,
    enrolledStudents: 95,
    progress: 0,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=300&h=300",
    certified: true,
    phaseId: "level-3",
    content: [
      {
        id: "section-1",
        title: "أساسيات تطوير الثغرات",
        items: [
          {
            id: "3-2-1",
            title: "مقدمة في تطوير الثغرات",
            duration: "40min",
            type: "video",
            completed: false,
            locked: false,
            description: "تعرف على المفاهيم الأساسية في تطوير واستغلال الثغرات"
          }
        ]
      }
    ]
  },
  {
    id: "3-3",
    slug: "advanced-web-exploitation",
    title: "استغلال تطبيقات الويب المتقدم",
    description: "تعلم تقنيات متقدمة في استغلال ثغرات تطبيقات الويب",
    duration: "6 أسابيع",
    level: "Advanced" as const,
    enrolledStudents: 85,
    progress: 0,
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=300&h=300",
    certified: true,
    phaseId: "level-3",
    content: [
      {
        id: "section-1",
        title: "الثغرات المتقدمة",
        items: [
          {
            id: "3-3-1",
            title: "مقدمة في الثغرات المتقدمة",
            duration: "35min",
            type: "video",
            completed: false,
            locked: false,
            description: "تعرف على الثغرات المتقدمة في تطبيقات الويب"
          }
        ]
      }
    ]
  }
]; 