import { AlgorithmType, Language, PracticeDifficulty } from './types';

export interface Translations {
  appName: string;
  modes: {
    watch: string;
    practice: string;
  };
  difficulties: Record<PracticeDifficulty, { label: string; desc: string }>;
  algorithms: Record<AlgorithmType, { name: string; subtitle: string }>;
  compares: string;
  swaps: string;
  progress: string;
  step: string;
  speed: string;
  preset: string;
  presets: {
    default: string;
    reversed: string;
    nearlySorted: string;
    random: string;
  };
  actions: {
    start: string;
    pause: string;
    reset: string;
    stepForward: string;
    stepBack: string;
    mute: string;
    unmute: string;
    themeLight: string;
    themeDark: string;
    runCode: string;
    resetCode: string;
    peekHint: string;
    hideHint: string;
  };
  practice: {
    referenceTitle: string;
    editorTitle: string;
    noCopyBadge: string;
    pasteBlockedWarning: string;
    copyBlockedWarning: string;
    blanksInstruction: string;
    rewriteInstruction: string;
    blindInstruction: string;
    peekRemaining: string;
    statusIdle: string;
    statusSuccess: string;
    statusReverse: string;
    statusUnsorted: string;
    statusCheat: string;
    statusSyntaxError: string;
    statusBlankEmpty: string;
    lineLabel: string;
    customCodeRunning: string;
  };
  tips: Record<string, string>;
}

export const I18N: Record<Language, Translations> = {
  en: {
    appName: 'ALGORITHM VISUALIZER',
    modes: {
      watch: 'Demo',
      practice: 'Trainer',
    },
    difficulties: {
      blanks: {
        label: '1. Fill Blanks',
        desc: 'Complete the missing conditions and index expressions.',
      },
      rewrite: {
        label: '2. Rewrite',
        desc: 'Type the complete algorithm looking at the protected reference.',
      },
      blind: {
        label: '3. From Memory',
        desc: 'Write the code without looking. Use peek only if stuck!',
      },
    },
    algorithms: {
      bubble: { name: 'BUBBLE SORT', subtitle: 'EXCHANGE SORTING ALGORITHM' },
      selection: { name: 'SELECTION SORT', subtitle: 'MINIMUM SELECTION ALGORITHM' },
      insertion: { name: 'INSERTION SORT', subtitle: 'INCREMENTAL INSERTION ALGORITHM' },
      quick: { name: 'QUICK SORT', subtitle: 'DIVIDE AND CONQUER PARTITION' },
    },
    compares: 'COMPARES',
    swaps: 'SWAPS',
    progress: 'PROGRESS',
    step: 'Step',
    speed: 'SPEED',
    preset: 'PRESET',
    presets: {
      default: 'Official Video',
      reversed: 'Reversed',
      nearlySorted: 'Nearly Sorted',
      random: 'Random',
    },
    actions: {
      start: 'Start',
      pause: 'Pause',
      reset: 'Reset',
      stepForward: 'Step Forward',
      stepBack: 'Step Back',
      mute: 'Mute Audio',
      unmute: 'Enable Audio',
      themeLight: 'Light Mode',
      themeDark: 'Dark Mode',
      runCode: 'Run on Crane',
      resetCode: 'Reset Editor',
      peekHint: 'Peek Reference (3s)',
      hideHint: 'Hidden Reference',
    },
    practice: {
      referenceTitle: 'Reference Sheet',
      editorTitle: 'Your Code Editor',
      noCopyBadge: 'Copy Locked',
      pasteBlockedWarning: 'Paste (Ctrl+V) is disabled! Type the code manually to build muscle memory.',
      copyBlockedWarning: 'Copying reference code is locked! Type it manually in the editor.',
      blanksInstruction: 'Fill in the missing logic blocks below and launch the crane to test:',
      rewriteInstruction: 'Retype the reference code manually. Copy & Paste are disabled:',
      blindInstruction: 'Reference is hidden! Write the algorithm from memory:',
      peekRemaining: 'Peeks used',
      statusIdle: 'Write your code and click "Run on Crane" to test it live.',
      statusSuccess: 'Brilliant! Your code sorted the array accurately on the crane!',
      statusReverse: 'Oops! Your crane sorted the array in reverse (descending) order. Check your comparison sign (< vs >).',
      statusUnsorted: 'The crane finished, but the array is not fully sorted yet. Check your loop bounds and swap logic!',
      statusCheat: 'Nice try! Built-in .sort() or sorted() is forbidden. Implement the algorithm logic manually.',
      statusSyntaxError: 'Syntax or runtime error in your code:',
      statusBlankEmpty: 'Please fill in all blank fields before running the crane.',
      lineLabel: 'Line',
      customCodeRunning: 'RUNNING YOUR CUSTOM CODE ON THE CRANE',
    },
    tips: {
      bubble_compare: 'ONLY COMPARES NEIGHBORS, TWO BY TWO',
      bubble_sink: 'EACH PASS SINKS THE LARGEST TO THE END',
      bubble_shorten: 'THEREFORE THE INNER LOOP SHORTENS',
      bubble_break: 'IF A PASS CHANGES NOTHING, IT IS FINISHED!',
      selection_search: 'SCANNING FOR THE MINIMUM ELEMENT IN REMAINING SUBARRAY',
      selection_found: 'FOUND MINIMUM, SWAPPING TO ITS SORTED POSITION',
      insertion_pick: 'EXTRACTING ELEMENT TO SHIFT INTO SORTED SUBARRAY',
      insertion_shift: 'SHIFTING LARGER ELEMENTS TO MAKE ROOM',
      quick_pivot: 'CHOOSING PIVOT AND PARTITIONING ELEMENTS',
      quick_swap: 'SWAPPING SMALLER ELEMENT TO LEFT OF PIVOT',
      complete: 'ARRAY COMPLETELY SORTED!',
    },
  },
  ru: {
    appName: 'ВИЗУАЛИЗАТОР АЛГОРИТМОВ',
    modes: {
      watch: 'Демонстрация',
      practice: 'Тренажёр',
    },
    difficulties: {
      blanks: {
        label: '1. Пропуски',
        desc: 'Заполните ключевые условия и индексы в готовом каркасе.',
      },
      rewrite: {
        label: '2. По образцу',
        desc: 'Перепишите код вручную, глядя на защищённую шпаргалку.',
      },
      blind: {
        label: '3. По памяти',
        desc: 'Напишите алгоритм по памяти без шпаргалки!',
      },
    },
    algorithms: {
      bubble: { name: 'СОРТИРОВКА ПУЗЫРЬКОМ', subtitle: 'АЛГОРИТМ ОБМЕННОЙ СОРТИРОВКИ' },
      selection: { name: 'СОРТИРОВКА ВЫБОРОМ', subtitle: 'ПОИСК МИНИМАЛЬНОГО ЭЛЕМЕНТА' },
      insertion: { name: 'СОРТИРОВКА ВСТАВКАМИ', subtitle: 'ПОШАГОВАЯ ВСТАВКА В ПОДМАССИВ' },
      quick: { name: 'БЫСТРАЯ СОРТИРОВКА', subtitle: 'РАЗДЕЛЕНИЕ ВОКРУГ ОПОРНОГО ЭЛЕМЕНТА' },
    },
    compares: 'СРАВНЕНИЙ',
    swaps: 'ОБМЕНОВ',
    progress: 'ПРОГРЕСС',
    step: 'Шаг',
    speed: 'СКОРОСТЬ',
    preset: 'ПРЕСЕТ',
    presets: {
      default: 'Из видео',
      reversed: 'Обратный',
      nearlySorted: 'Почти готов',
      random: 'Случайный',
    },
    actions: {
      start: 'Старт',
      pause: 'Пауза',
      reset: 'Сброс',
      stepForward: 'Шаг вперед',
      stepBack: 'Шаг назад',
      mute: 'Выкл. звук',
      unmute: 'Вкл. звук',
      themeLight: 'Светлая тема',
      themeDark: 'Темная тема',
      runCode: 'Запустить на кране',
      resetCode: 'Сбросить код',
      peekHint: 'Подсмотреть (3 сек)',
      hideHint: 'Шпаргалка скрыта',
    },
    practice: {
      referenceTitle: 'Образец кода',
      editorTitle: 'Ваш редактор кода',
      noCopyBadge: 'Защита от копирования',
      pasteBlockedWarning: 'Вставка (Ctrl+V) отключена! Печатайте код руками — так работает мышечная память.',
      copyBlockedWarning: 'Копирование образца заблокировано! Перепишите код вручную.',
      blanksInstruction: 'Впишите недостающие выражения в поля ниже и запустите кран:',
      rewriteInstruction: 'Перепишите код с образца вручную (копирование и вставка отключены):',
      blindInstruction: 'Образец скрыт! Напишите код алгоритма по памяти:',
      peekRemaining: 'Подсказок взято',
      statusIdle: 'Напишите код и нажмите «Запустить на кране» для живой проверки.',
      statusSuccess: 'Браво! Ваш код идеально отсортировал массив на кране!',
      statusReverse: 'Ой! Ваш кран отсортировал массив задом наперёд (по убыванию). Проверьте знак сравнения (< или >).',
      statusUnsorted: 'Кран завершил работу, но массив отсортирован не полностью. Проверьте границы циклов и обмен!',
      statusCheat: 'Хитро! Но встроенные .sort() и sorted() запрещены. Реализуйте алгоритм самостоятельно.',
      statusSyntaxError: 'Ошибка в коде:',
      statusBlankEmpty: 'Заполните все пропущенные поля перед запуском крана.',
      lineLabel: 'Строка',
      customCodeRunning: 'ВЫПОЛНЯЕТСЯ ВАШ КОД НА КРАНЕ',
    },
    tips: {
      bubble_compare: 'СРАВНИВАЕТ ТОЛЬКО СОСЕДЕЙ, ПО ДВОЕ',
      bubble_sink: 'КАЖДЫЙ ПРОХОД ОПУСКАЕТ НАИБОЛЬШИЙ В КОНЕЦ',
      bubble_shorten: 'ПОЭТОМУ ВНУТРЕННИЙ ЦИКЛ СОКРАЩАЕТСЯ',
      bubble_break: 'ЕСЛИ НЕТ ОБМЕНОВ — СОРТИРОВКА ЗАВЕРШЕНА!',
      selection_search: 'ПОИСК НАИМЕНЬШЕГО ЭЛЕМЕНТА В НЕОТСОРТИРОВАННОЙ ЧАСТИ',
      selection_found: 'МИНИМУМ НАЙДЕН, ПЕРЕМЕЩАЕМ НА СВОЮ ПОЗИЮ',
      insertion_pick: 'ИЗВЛЕКАЕМ ЭЛЕМЕНТ ДЛЯ ВСТАВКИ В ОТСОРТИРОВАННУЮ ЧАСТЬ',
      insertion_shift: 'СДВИГАЕМ БОЛЬШИЕ ЭЛЕМЕНТЫ ВПРАВО',
      quick_pivot: 'ВЫБИРАЕМ ОПОРНЫЙ ЭЛЕМЕНТ И РАЗДЕЛЯЕМ МАССИВ',
      quick_swap: 'ПЕРЕМЕЩАЕМ МЕНЬШИЙ ЭЛЕМЕНТ ЛЕВЕЕ ОПОРНОГО',
      complete: 'МАССИВ ПОЛНОСТЬЮ ОТСОРТИРОВАН!',
    },
  },
  uz: {
    appName: 'ALGORITMLAR VIZUALIZATORI',
    modes: {
      watch: 'Namoyish',
      practice: 'Trenajyor',
    },
    difficulties: {
      blanks: {
        label: '1. Bo\'shliqlar',
        desc: 'Kodning tushirib qoldirilgan muhim joylarini to\'ldiring.',
      },
      rewrite: {
        label: '2. Namuna bo\'yicha',
        desc: 'Himoyalangan namunaga qarab kodni qo\'lda yozing.',
      },
      blind: {
        label: '3. Xotiradan',
        desc: 'Namunasiz kodni xotiradan mustaqil yozing!',
      },
    },
    algorithms: {
      bubble: { name: 'PUFAKCHALI SARALASH', subtitle: 'ALMASHTIRISH ORQALI SARALASH' },
      selection: { name: 'TANLASH ORQALI SARALASH', subtitle: 'ENG KICHIK ELEMENTNI TANLASH' },
      insertion: { name: 'QO\'YISH ORQALI SARALASH', subtitle: 'KETMA-KET JOYLASHTIRISH' },
      quick: { name: 'TEZKOR SARALASH', subtitle: 'BO\'LIB TASHLA VA HUKMRONLIK QIL' },
    },
    compares: 'TAQQOSLASH',
    swaps: 'ALMASHTIRISH',
    progress: 'JARAYON',
    step: 'Qadam',
    speed: 'TEZLIK',
    preset: 'PRESET',
    presets: {
      default: 'Videodagi holat',
      reversed: 'Teskari tartib',
      nearlySorted: 'Deyarli tayyor',
      random: 'Tasodifiy',
    },
    actions: {
      start: 'Boshlash',
      pause: 'To\'xtatish',
      reset: 'Qayta o\'rnatish',
      stepForward: 'Oldinga qadam',
      stepBack: 'Orqaga qadam',
      mute: 'Ovozni o\'chirish',
      unmute: 'Ovozni yoqish',
      themeLight: 'Yorug\' rejim',
      themeDark: 'Qorong\'u rejim',
      runCode: 'Kranda tekshirish',
      resetCode: 'Kodni tozalash',
      peekHint: 'Ko\'rib olish (3 soniya)',
      hideHint: 'Namuna yashirilgan',
    },
    practice: {
      referenceTitle: 'Kod namunasi',
      editorTitle: 'Sizning kod muharriringiz',
      noCopyBadge: 'Nusxalash bloklangan',
      pasteBlockedWarning: 'Qo\'yish (Ctrl+V) o\'chirilgan! Kodni qo\'lda yozing — bu eslab qolishga yordam beradi.',
      copyBlockedWarning: 'Namunadan nusxa olish bloklangan! Kodni qo\'lda tering.',
      blanksInstruction: 'Quyidagi bo\'sh joylarni to\'ldiring va kranni ishga tushiring:',
      rewriteInstruction: 'Kodni namunaga qarab qo\'lda tering (nusxalash o\'chirilgan):',
      blindInstruction: 'Namuna yashirilgan! Algoritmni xotiradan yozing:',
      peekRemaining: 'Maslahatlar olindi',
      statusIdle: 'Kodni yozing va tekshirish uchun "Kranda tekshirish" tugmasini bosing.',
      statusSuccess: 'Ajoyib! Sizning kodingiz massivni kranda to\'g\'ri saraladi!',
      statusReverse: 'Diqqat! Kran massivni teskari (kamayish) tartibda saraladi. Taqqoslash belgisini (< yoki >) tekshiring.',
      statusUnsorted: 'Kran ishini tugatdi, lekin massiv to\'liq saralanmadi. Sikl chegaralarini tekshiring!',
      statusCheat: 'Tayyor .sort() yoki sorted() funksiyalaridan foydalanish mumkin emas! Algoritmni o\'zingiz yozing.',
      statusSyntaxError: 'Kodda xatolik:',
      statusBlankEmpty: 'Ishga tushirishdan oldin barcha bo\'sh joylarni to\'ldiring.',
      lineLabel: 'Qator',
      customCodeRunning: 'SIZNING KODINGIZ KRANDA BAJARILMOQDA',
    },
    tips: {
      bubble_compare: 'FAQAT QO\'SHNILARNI IKKITADAN TAQQOSLAYDI',
      bubble_sink: 'HAR BIR O\'TISH ENG KATTASINI OXIRIGA TUSHIRADI',
      bubble_shorten: 'SHUNING UCHUN ICHKI SIKL QISQARADI',
      bubble_break: 'AGAR BIROR O\'TISHDA O\'ZGARISH BO\'LMASA — TUGADI!',
      selection_search: 'QOLGAN QISMIDAN ENG KICHIK ELEMENT QIDIRILMOQDA',
      selection_found: 'ENG KICHIK TOPILDI, O\'Z O\'RNIGA JOYLASHTIRILMOQDA',
      insertion_pick: 'SARALANGAN QISMGA JOYLASHTIRISH UCHUN ELEMENT OLINMOQDA',
      insertion_shift: 'KATTAROQ ELEMENTLARNI O\'NGGA SURISH',
      quick_pivot: 'TAYANCH ELEMENT TANLASH VA ELEMENTLARNI BO\'LISH',
      quick_swap: 'KICHIK ELEMENTNI TAYANCHNING CHAP TARAFIGA O\'TKAZISH',
      complete: 'MASSIV TO\'LIQ SARALANDI!',
    },
  },
};
