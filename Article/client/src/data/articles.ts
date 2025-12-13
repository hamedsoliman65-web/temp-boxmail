import img1 from "@assets/stock_images/technology_code_abst_236242b3.jpg";
import img2 from "@assets/stock_images/technology_code_abst_6c3507fe.jpg";
import img3 from "@assets/stock_images/technology_code_abst_d37f911f.jpg";
import img4 from "@assets/stock_images/technology_code_abst_e7324ca2.jpg";
import img5 from "@assets/stock_images/technology_code_abst_cd22e096.jpg";
import img6 from "@assets/stock_images/technology_code_abst_6c557fc7.jpg";

export type Article = {
  id: string;
  thumbnail: string;
  title: {
    ar: string;
    en: string;
  };
  description: {
    ar: string;
    en: string;
  };
  content: {
    ar: string;
    en: string;
  };
};

export const articles: Article[] = [
  {
    id: "1",
    thumbnail: img1,
    title: {
      ar: "مستقبل الذكاء الاصطناعي",
      en: "The Future of Artificial Intelligence",
    },
    description: {
      ar: "كيف سيغير الذكاء الاصطناعي حياتنا في العقد القادم؟",
      en: "How AI will change our lives in the next decade?",
    },
    content: {
      ar: "الذكاء الاصطناعي ليس مجرد موجة عابرة، بل هو ثورة حقيقية تعيد تشكيل كل جانب من جوانب حياتنا. من الرعاية الصحية إلى التعليم، ومن الصناعة إلى الترفيه، تفتح تقنيات التعلم الآلي آفاقاً جديدة لم نكن نتخيلها. في هذا المقال، نستكشف التطبيقات الحالية والمستقبلية لهذه التكنولوجيا وكيف يمكننا الاستعداد لعصر الآلة.",
      en: "Artificial Intelligence is not just a passing trend; it is a true revolution reshaping every aspect of our lives. From healthcare to education, industry to entertainment, machine learning technologies are opening new horizons we never imagined. In this article, we explore current and future applications of this technology and how we can prepare for the age of the machine.",
    },
  },
  {
    id: "2",
    thumbnail: img2,
    title: {
      ar: "أمن المعلومات في العصر الرقمي",
      en: "Cybersecurity in the Digital Age",
    },
    description: {
      ar: "أهم النصائح لحماية بياناتك الشخصية والمؤسسية.",
      en: "Top tips to protect your personal and corporate data.",
    },
    content: {
      ar: "مع تزايد الاعتماد على الإنترنت، تتزايد المخاطر السيبرانية. الهجمات الإلكترونية لم تعد تستهدف الشركات الكبرى فقط، بل الأفراد أيضاً. سنتعرف في هذا المقال على استراتيجيات الدفاع الأساسية، وأهمية التشفير، وكيفية بناء وعي أمني قوي لحماية أصولك الرقمية من الاختراق.",
      en: "As reliance on the internet grows, so do cyber risks. Cyberattacks no longer target just big corporations, but individuals too. In this article, we'll learn about basic defense strategies, the importance of encryption, and how to build strong security awareness to protect your digital assets from hacking.",
    },
  },
  {
    id: "3",
    thumbnail: img3,
    title: {
      ar: "تطور لغات البرمجة",
      en: "Evolution of Programming Languages",
    },
    description: {
      ar: "رحلة من لغة الآلة إلى لغات البرمجة الحديثة.",
      en: "A journey from machine code to modern programming languages.",
    },
    content: {
      ar: "لغات البرمجة هي الأداة التي نبني بها العالم الرقمي. بدأت كأكواد ثنائية معقدة وتطورت لتصبح لغات عالية المستوى تشبه لغة البشر. نستعرض تاريخ تطور البرمجة، والفرق بين اللغات المترجمة والمفسرة، وما هي اللغة الأنسب للبدء بها في عام 2025.",
      en: "Programming languages are the tools with which we build the digital world. They started as complex binary codes and evolved into high-level languages resembling human speech. We review the history of programming evolution, the difference between compiled and interpreted languages, and which language is best to start with in 2025.",
    },
  },
  {
    id: "4",
    thumbnail: img4,
    title: {
      ar: "الحوسبة السحابية",
      en: "Cloud Computing",
    },
    description: {
      ar: "كيف غيرت السحابة مفهوم تخزين ومعالجة البيانات؟",
      en: "How the cloud changed data storage and processing concepts?",
    },
    content: {
      ar: "لم تعد الشركات بحاجة إلى امتلاك خوادم ضخمة ومكلفة. الحوسبة السحابية وفرت مرونة هائلة وقوة معالجة غير محدودة عند الطلب. نناقش هنا أنواع السحابة (العامة، الخاصة، والهجينة) وكيف تساهم في تسريع الابتكار وتقليل التكاليف للشركات الناشئة والكبرى على حد سواء.",
      en: "Companies no longer need to own massive, expensive servers. Cloud computing provided immense flexibility and unlimited processing power on demand. Here we discuss cloud types (public, private, hybrid) and how they contribute to accelerating innovation and reducing costs for startups and enterprises alike.",
    },
  },
  {
    id: "5",
    thumbnail: img5,
    title: {
      ar: "انترنت الأشياء (IoT)",
      en: "Internet of Things (IoT)",
    },
    description: {
      ar: "عندما تتحدث الأجهزة مع بعضها البعض.",
      en: "When devices talk to each other.",
    },
    content: {
      ar: "من الثلاجة الذكية إلى المدن الذكية، إنترنت الأشياء يربط العالم المادي بالعالم الرقمي. المستشعرات والأجهزة المتصلة تجمع البيانات وتحللها لاتخاذ قرارات ذكية. هذا المقال يغطي تحديات إنترنت الأشياء، مثل الخصوصية واستهلاك الطاقة، والفرص الهائلة التي يتيحها.",
      en: "From smart fridges to smart cities, IoT connects the physical world to the digital one. Sensors and connected devices collect and analyze data to make smart decisions. This article covers IoT challenges, such as privacy and energy consumption, and the immense opportunities it offers.",
    },
  },
  {
    id: "6",
    thumbnail: img6,
    title: {
      ar: "الواقع المعزز والافتراضي",
      en: "AR & VR Technologies",
    },
    description: {
      ar: "الفرق بينهما واستخداماتهما في التعليم والترفيه.",
      en: "Differences and uses in education and entertainment.",
    },
    content: {
      ar: "الحدود بين الواقع والخيال تتلاشى. الواقع الافتراضي يأخذك إلى عوالم جديدة كلياً، بينما الواقع المعزز يضيف طبقات رقمية إلى عالمك الحقيقي. نستكشف كيف تغير هذه التقنيات طرق التدريب، الألعاب، وحتى التسوق والتصميم الهندسي.",
      en: "The boundaries between reality and fiction are fading. VR takes you to entirely new worlds, while AR adds digital layers to your real world. We explore how these technologies are changing training, gaming, and even shopping and engineering design.",
    },
  },
];
