let scoreA = 0;
let scoreB = 0;
let currentQuestion = null;
let countdown;
let lockedQuestions = new Set();

document.addEventListener("DOMContentLoaded", function() {
    let resetButton = document.createElement("button");
    resetButton.innerText = "🔄 عيد القيم";
    resetButton.classList.add("reset-btn");
    resetButton.onclick = resetGame;
    document.body.appendChild(resetButton);

    scoreA = parseInt(localStorage.getItem("scoreA")) || 0;
    scoreB = parseInt(localStorage.getItem("scoreB")) || 0;
    lockedQuestions = new Set(JSON.parse(localStorage.getItem("lockedQuestions")) || []);

    document.getElementById("scoreA").innerText = scoreA;
    document.getElementById("scoreB").innerText = scoreB;

    document.querySelectorAll(".points button").forEach((button, index) => {
        button.dataset.id = `${button.parentElement.parentElement.id}-${button.innerText}-${index}`;
        if (lockedQuestions.has(button.dataset.id)) {
            button.classList.add('locked');
            button.disabled = true;
            button.style.backgroundColor = "gray";
        }
        button.onclick = () => selectQuestion(button.parentElement.parentElement.id, parseInt(button.innerText), button);
    });
});

function selectQuestion(category, points, button) {
    if (lockedQuestions.has(button.dataset.id)) return;
    currentQuestion = { category, points, ...getQuestion(category, points), buttonId: button.dataset.id };
    displayQuestion(currentQuestion);
}

function getQuestion(category, points) {
    const questions = {
        'general-info': { 
            200: [
                {question: "ما هو الحيوان الذي لديه اكبر قلب ؟", answer: " الحوت الأزرق"},
                {question: "ما هو اطول عضو في جسم الأنسان", answer: "الجلد"}
            ],
            
            400: [
                {question: "ما هي اصغر عظمة في جسم الأنسان؟", answer: "عظمة الركاب في الأذن", image: "assets/g400.jpg"},
                {question: "كم عددأبواب المسجد الأقصى؟", answer: "14 باب  ", image: "assets/g401.jpg"}
            ],
            600: [
                {question: "ما أطول أنواع الثعابين؟", answer: "الأناكوندا", image: "assets/g600.jpg"},
                {question: "من أول من قرر العلاج المجاني ؟", answer: "المسلمون في العصور الأولى "}
            ]
        },
        'cars': { 
            200: [
                {question: "ما هي الشركة التي طورت أول سيارة هجينة تجارية؟", answer: "تويوتا (بريوس - 1997)", image: "assets/c200.jpg"},
                {question: "ما هي السيارة التي تُعرف بلقب (ملكة الصحراء)؟", answer: "تويوتا لاند كروزر"}
            ],
            400: [
                {question: "ما الفرق بين الدفع الخلفي والدفع الأمامي؟", answer: "الدفع الأمامي (FWD):  يساهم في توفير الوقود وتحسين الثبات على الطرق.\nالدفع الخلفي (RWD):  يمنح السيارة أداءً أفضل على السرعات العالية وتحكمًا أكبر.", image: "assets/c400.png"},
                {question: "ما هي اسرع سيارة كهربائية على المد", answer: " ريماك نيفيرا."}
            ],
            600: [
                {question: "ما هو اسم السيارة التي استخدمت محرك طائرة بريطانية وتمكنت من تحطيم أرقام قياسية في السرعة؟", answer: " ثراست SSC "},
                {question: "ما هو أعلى رقم في قوة الأحصنة تم تسجيله في سيارة إنتاجية؟", answer: " 2000 حصان (ريماك نيفيرا وكوينيجسيج جيميرا)"}
            ]
        },
        'quran': { 
            200: [
                {question: "ما هي السورة التي تعدل ثلث القرآن؟", answer: "سورة الأخلاص"},
                {question: "ما هي أطول آية في القرآن الكريم؟", answer: "آية الدين في سورة البقرة (الآية 282)."}
            ],
            400: [
                {question: "كم عدد أحزاب القرآن الكريم؟", answer: "60 حزبًا."},
                {question: "ماهي السورة التي ذكر في كل آية فيها لفظ الجلالة (الله)", answer: "سورة المجادلة "},
            ],
            600: [
                {question: "ما هي السورة التي تبدأ وتنتهي بآية (سَبِّحْ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ)؟", answer: "سورة الحشر."},
                {question: "ما هي السورة التي تتحدث عن (الغش) والاحتيال؟", answer: "سورة المطففين."}
            ]
        },
        'prophets': { 
            200: [
                {question: "من هو النبي الذي عاش 950 سنة", answer: "نوح عليه السلام"},
                {question: "أي نبي خصه الله سبحانه وتعالى بالتكليم المباشر دون واسطة من الملائكة أو غيرهم؟", answer: " موسى عليه السلام."}
            ],
            400: [
                {question: "  من هو النبي الذي أرسل إلى قوم ثمود؟", answer: " النبي صالح عليه السلام."},
                {question: "من هو النبي الذي أرسل إلى قوم مدين؟", answer: "النبي شعيب عليه السلام."},
            ],
            600: [
                {question: " من هو النبي الذي طلب منه قومه أن ينزل لهم من السماء مائدة؟ ", answer: " هو النبي عيسى عليه السلام."},
                {question: "من النبي الذي أماته الله مائة عام ثم بعثه؟", answer: " نبي الله عزير عليه السلام، كما قال تعالى: (فَأَمَاتَهُ اللَّهُ مِائَةَ عَامٍ ثُمَّ بَعَثَهُ) (البقرة: 259)."}
            ]
        },
        'classico': { 
            200: [
                {question: " ما هي الدولة التي يتوسط علمها رمز نجمي خماسي باللون الأخضر ؟", answer: "المغرب"},
                {question: "ما هي الدولة التي يحمل علمها نسرًا ذهبيًا؟", answer: "المكسيك"}
            ],
            400: [
                {question: "ما هي الدولة التي يقع فيها الجزء الجنوبي من جبل إيفرست، وتُعد موطنًا للعديد من متسلقي الجبال؟", answer: "نيبال 🇳🇵 ", image: "assets/b400.webp"},
                {question: "ما هي الدولة التي يقع فيها معبد الكرنك؟", answer: "مصر "}
            ],
            600: [
                {question: " أي دولة عربية غيرت علمها أكثر عدد مرات؟", answer: " العراق"},
                {question: "أي دولة عربية كان علمها أخضر بالكامل بدون أي رموز سابقًا؟", answer: "ليبيا"}
            ]
        },
        'puzzles': { 
            200: [
                {question: "انا ابن الماء لكن اذا وضعت فيه مت من انا ؟", answer: "الثلج", image: "assets/p200.jpg"},
                {question: "ما هو الشيء الذي يستطيع حمل أوزان ثقيلة لكنه لا يستطيع حمل مسمار؟", answer: "البحر", image: "assets/p201.png"}
            ],
            400: [
                {question: "حل اللغز؟", answer: "قط / بطريق / بط / بقر", image: "assets/p400.jpg"},
                {question: "حل اللغز؟", answer: "رقم 2 ", image: "assets/p401.jpg"}
            ],
            600: [
                {question: "افتح القفل؟", answer: "يوجد جوابان صحيحين الجواب الأصح ب النسبة لي 694 , الجواب الثاني 394", image: "assets/p600.jpg"},
                {question: "افتح القفل؟", answer: "497", image: "assets/p601.jpg"}
            ]
        }
    };
    

    let questionList = questions[category] ? questions[category][points] : [];

    if (questionList.length === 0) return null;

    // تحميل `index` من `localStorage` أو بدء المؤشر من 0
    let usedIndexes = JSON.parse(localStorage.getItem("usedIndexes")) || {};
    
    if (!usedIndexes[category]) usedIndexes[category] = {};
    if (!usedIndexes[category][points]) usedIndexes[category][points] = 0;

    let currentIndex = usedIndexes[category][points];

    // إذا تجاوز المؤشر عدد الأسئلة، أعد تعيينه للصفر
    if (currentIndex >= questionList.length) {
        usedIndexes[category][points] = 0;
        currentIndex = 0;
    }

    let selectedQuestion = questionList[currentIndex];

    // تحديث المؤشر وحفظه في `localStorage`
    usedIndexes[category][points] += 1;
    localStorage.setItem("usedIndexes", JSON.stringify(usedIndexes));

    return selectedQuestion;
}



function displayQuestion(question) {
    document.body.innerHTML = `
        <div class='question-container' style="text-align: center; padding: 40px; max-width: 800px; margin: auto; background: #fff; border-radius: 15px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);">
            
            <!-- المؤقت في الأعلى -->
            <div class='timer' style="font-size: 28px; margin-bottom: 15px; color: #333; font-weight: bold;">
                ⏳ <span id='countdown'>0:00</span>
            </div>

            <!-- السؤال -->
            <h2 style="font-size: 32px; color: red; margin-bottom: 20px;">${question.question}</h2>
            
            <!-- صورة السؤال (إذا وجدت) -->
            ${question.image ? `<img src="${question.image}" alt="صورة السؤال" 
                style="max-width: 400px; height: auto; border-radius: 10px; margin: 20px auto; display: block;">` : ''}

            <!-- أزرار التحكم -->
            <div style="display: flex; justify-content: center; gap: 15px; margin-top: 20px;">
                <button onclick="showAnswer()" style="font-size: 20px; padding: 12px 25px; background: green; color: white; border: none; border-radius: 8px; cursor: pointer;">✅ عرض الإجابة</button>
                <button onclick="displayAnswerSelection()" style="font-size: 20px; padding: 12px 25px; background: orange; color: white; border: none; border-radius: 8px; cursor: pointer;">🙋 منو جاوب؟</button>
                <button onclick="returnToMain()" style="font-size: 20px; padding: 12px 25px; background: red; color: white; border: none; border-radius: 8px; cursor: pointer;">🔙 العودة</button>
            </div>

            <!-- عرض الإجابة عند الضغط -->
            <div id='answer-display' style="display: none; margin-top: 20px; font-size: 28px; font-weight: bold; color: blue;">
                📝 الإجابة الصحيحة هي: ${question.answer}
            </div>
        </div>
    `;

    startTimer();
}



function startTimer() {
    timeElapsed = 0;

    // تأكد من مسح أي عداد سابق قبل بدء واحد جديد
    if (countdown) {
        clearInterval(countdown);
    }

    countdown = setInterval(() => {
        let countdownElement = document.getElementById('countdown');
        if (countdownElement) {
            let minutes = Math.floor(timeElapsed / 60); // حساب الدقائق
            let seconds = timeElapsed % 60; // حساب الثواني
            let formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`; // تنسيق العرض مثل 1:09
            countdownElement.innerText = formattedTime;
            timeElapsed++;
        } else {
            clearInterval(countdown);
        }
    }, 1000);
}



function showAnswer() {
    document.getElementById('answer-display').style.display = 'block';
}

function displayAnswerSelection() {
    document.body.innerHTML = `
        <div class='answer-selection'>
            <h2>منو جاوب صح؟</h2>
            <button onclick="answerQuestion('A')">🥇الأسود</button>
            <button onclick="answerQuestion('B')">🥇الأبطال</button>
            <button onclick="noOneAnswered()">🚫 ولا أحد</button>
        </div>
    `;
    clearInterval(countdown);
}
function noOneAnswered() {
    lockQuestion(currentQuestion.buttonId);
    returnToMain();
}



function answerQuestion(team) {
    if (team === "A") {
        scoreA += currentQuestion.points;
        localStorage.setItem("scoreA", scoreA);
    } else if (team === "B") {
        scoreB += currentQuestion.points;
        localStorage.setItem("scoreB", scoreB);
    }
    lockQuestion(currentQuestion.buttonId);
    returnToMain();
}

function lockQuestion(buttonId) {
    lockedQuestions.add(buttonId);
    localStorage.setItem("lockedQuestions", JSON.stringify([...lockedQuestions]));
    let btns = document.querySelectorAll("button[data-id]");
    btns.forEach(btn => {
        if (btn.dataset.id === buttonId) {
            btn.classList.add('locked');
            btn.disabled = true;
            btn.style.backgroundColor = "gray";
        }
    });
}

function returnToMain() {
    window.location.href = "index.html";
}

function resetGame() {
    localStorage.clear();
    window.location.href = "index.html";
}
