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
    progress: 0,
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
    progress: 0,
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
            completed: false,
            locked: false,
            description: "فهم طبقات نموذج OSI وكيفية تفاعلها"
          },
          {
            id: "1-1-3",
            title: "[LAB] تحليل حزم البيانات",
            duration: "30min",
            type: "lab",
            completed: false,
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
            completed: false,
            locked: true,
            description: "فهم أساسيات بروتوكول TCP/IP وكيفية عمله"
          },
          {
            id: "1-1-5",
            title: "تحليل المنافذ والخدمات",
            duration: "20min",
            type: "text",
            completed: false,
            locked: true,
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
    progress: 0,
    image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=300&h=300",
    certified: true,
    phaseId: "level-1"
  },
  {
    id: "1-3",
    slug: "cybersecurity-intro",
    title: "مقدمة في الأمن السيبراني",
    description: "فهم المفاهيم الأساسية للأمن السيبراني والتهديدات الشائعة",
    duration: "3 أسابيع",
    level: "Beginner" as const,
    enrolledStudents: 210,
    progress: 0,
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=300&h=300",
    certified: true,
    phaseId: "level-1"
  }
]; 