// src/utils/budgetAnalysis.js

export const getAnalysisComment = (totalIncome, transactions) => {
    
    // Эгерде транзакция жок болсо, жалпы билдирүү
    if (!transactions || transactions.length === 0) {
        return "ℹ️ Сураныч, транзакцияларды киргизиңиз. Киреше жана Чыгымдарды кошкондо, кеңештер пайда болот.";
    }

    // 1. Чыгашаларды топтоо
    let totalExpense = 0;
    let expenseByCategory = {};

    transactions.forEach(t => {
        if (t.type === 'Чыгым' && t.amount > 0) { 
            totalExpense += t.amount;
            const category = t.category || 'Башка чыгым'; 
            expenseByCategory[category] = (expenseByCategory[category] || 0) + t.amount;
        }
    });
    
    // Эгерде жалпы киреше нөл болсо, чыгымдарга гана таянып кеңеш берүү
    if (totalIncome <= 0) {
        if (totalExpense > 0) {
            return `⚠️ Кирешеңиз 0 KGS. Сиз бул айда ${totalExpense.toFixed(0)} KGS короттуңуз. Срочно Кирешени киргизиңиз же бюджетиңизди караңыз!`;
        }
        return "ℹ️ Кирешени (Эмгек акы) киргизиңиз. Анализ ошондо башталат.";
    }


    // 2. 50/30/20 Эрежесин Колдонуу
    const needsLimit = totalIncome * 0.50;
    const wantsLimit = totalIncome * 0.30;
    const savingsGoal = totalIncome * 0.20;
    
    let comments = [];
    let currentSavings = totalIncome - totalExpense;

    // A. Жалпы Бюджетти Анализдөө
    
    // Чыгымдар өтө көп болсо
    if (totalExpense > needsLimit + wantsLimit) { 
        comments.push(`🚨 Чыгымдар өтө жогору (${totalExpense.toFixed(0)} KGS). Сиздин үнөмдөө максатыңызга жетүүгө кыйын болууда.`);
    } else if (currentSavings >= savingsGoal) {
         comments.push(`✅ Мыкты! Сиз ${savingsGoal.toFixed(0)} KGS сактоо максатына жеттиңиз. Жалпы чыгымдар: ${totalExpense.toFixed(0)} KGS.`);
    } else if (currentSavings < 0) {
        comments.push("❌ Эскертүү: Сиздин чыгымыңыз кирешеден ашты! Карыздан алыс болуңуз.");
    } else if (currentSavings < savingsGoal && currentSavings >= 0) {
         comments.push(`💡 Сактоо максатына жетүү үчүн дагы ${ (savingsGoal - currentSavings).toFixed(0) } KGS керек.`);
    }

    // B. Категориялык Анализ
    
    const foodSpend = expenseByCategory['Тамак-аш'] || 0;
    // Тамак-ашка 50% чектен (керектөөдөн) 50% ашык коротсо (б.а. Кирешенин 25%ынан ашык)
    if (foodSpend > needsLimit * 0.5) { 
        comments.push(`🍔 Тамак-ашка кеткен чыгымдар жогору (${foodSpend.toFixed(0)} KGS). ${needsLimit * 0.5} KGS чегинен аштыңыз. Үйдө тамактанууга аракет кылыңыз.`);
    }
    
    const transportSpend = expenseByCategory['Транспорт'] || 0;
    // Транспортко 30% чектен (каалоодон) 70% ашык коротсо (б.а. Кирешенин 21%ынан ашык)
    if (transportSpend > wantsLimit * 0.7) {
        comments.push(`🚌 Транспортко көп каражат жумшап жатасыз (${transportSpend.toFixed(0)} KGS). Коомдук транспорт же жөө басууну караңыз.`);
    }
    
    const otherSpend = expenseByCategory['Башка'] || 0;
    if (otherSpend > wantsLimit * 0.5) {
        comments.push(`💸 "Башка" категориясындагы чыгымдар өтө көп. Бул чыгымдарды көзөмөлдөңүз.`);
    }

    // 4. Финалдык Жыйынтык
    if (comments.length === 0) {
        return "👍 Бюджетиңиз тең салмакта. Улантыңыз!";
    }

    return comments.join('\n'); 
};