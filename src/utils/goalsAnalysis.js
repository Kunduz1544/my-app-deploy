// src/utils/goalsAnalysis.js (Толукталган Кеңештер)

/**
 * Максаттардын абалын талдап, кеңештерди берет.
 * @param {Array} goals - Максаттардын массиви.
 * @returns {string} - Бир нече саптан турган кеңештердин тизмеси.
 */
export const getGoalsAnalysisComment = (goals) => {
    
    if (!goals || goals.length === 0) {
        return "ℹ️ Сизде учурда активдүү максаттар жок. Биринчи максатыңызды түзүүдөн баштаңыз!";
    }

    let overallComments = [];
    let completedCount = 0;
    let idleGoals = [];
    let activeGoalsCount = 0;
    const totalGoals = goals.length;
    let progressSum = 0;

    goals.forEach(goal => {
        const { title, saved, target } = goal;
        
        const numericTarget = Number(target) || 0;
        const numericSaved = Number(saved) || 0;

        if (numericTarget <= 0) return; 

        activeGoalsCount++;
        const progressPercent = (numericSaved / numericTarget);
        const percent = Math.min(Math.round(progressPercent * 100), 100);
        
        progressSum += progressPercent;

        // 1. Аткарылган максаттар
        if (numericSaved >= numericTarget) {
            completedCount++;
            return; 
        }

        // 2. Жакындоо (70%дан ашты) - Тездетүү
        if (percent >= 70) {
            const remaining = numericTarget - numericSaved;
            // Кеңеште сумманы форматтоо (мисалы: 10000 сом)
            const formattedRemaining = new Intl.NumberFormat('ky-KG').format(remaining);
            overallComments.push(`🚀 **${title}:** Абдан жакын! Дагы ${formattedRemaining} сом калды. Акыркы күч-аракетиңизди жумшаңыз!`);
        }

        // 3. Жай темп (1%дан 30%га чейин)
        else if (percent > 0 && percent < 30) {
            overallComments.push(`🐌 **${title}:** Темпти күчөтүңүз. Айлык салымыңызды көбөйтүүнү же бул максатка көбүрөөк көңүл бурууну караңыз.`);
        }
        
        // 4. Эч кандай салым жок (0%) - Токтоп калуу
        else if (numericSaved === 0 && numericTarget > 0) {
             idleGoals.push(title);
        }
    });

    // --- Жалпы Кеңештерди Жыйынтыктоо ---
    
    // Максаттардын саны өтө көп (5тен ашык)
    if (activeGoalsCount > 5) {
        overallComments.unshift(`🤯 **Көптөгөн максаттар!** Сиз ${activeGoalsCount} максатка көңүл буруп жатасыз. Эң маанилүү 3-5 максатка гана топтолууну ойлонуңуз.`);
    }

    // Аткарылган
    if (completedCount > 0) {
        overallComments.unshift(`🎉 **Куттуктайбыз!** Сиз ${completedCount} максатты ийгиликтүү аткардыңыз!`);
    }

    // Токтоп калган максаттар
    if (idleGoals.length > 0) {
        overallComments.push(`⚠️ **Көңүл буруңуз:** ${idleGoals.join(', ')} максаттарына салым кошуу токтоп калган. Аракетти кайра баштаңыз!`);
    }
    
    // Эгерде жалпы комментарийлер жок болсо, бирок активдүү максаттар бар болсо (Демейки позитивдүү)
    if (overallComments.length === 0 && activeGoalsCount > 0) {
        const averageProgress = progressSum / activeGoalsCount;
        if (averageProgress < 0.20) {
             return "🟡 Максаттарыңыз бар, бирок жалпы прогресс жай. Аманат салууну көбөйтүү мүмкүнчүлүгүн карап көрүңүз.";
        }
        return "👍 Бардык максаттар тең салмакта өсүп жатат. Адаттарыңызды сактаңыз!";
    }
    
    return overallComments.join('\n');
};