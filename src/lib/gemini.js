export async function sendMessageToGemini(message, userFinancialData) {
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

    // DEMO MODE: If no API key is provided, return a high-quality personalized mock response
    if (!API_KEY || API_KEY === "") {
        console.warn("VITE_GEMINI_API_KEY not found. Running in Demo Mode with mock responses.");

        // Simulate a short delay for realism
        await new Promise(resolve => setTimeout(resolve, 1500));

        const lowerMsg = message.toLowerCase();

        if (lowerMsg.includes("score")) {
            return `Based on your data, your **Financial Score is ${userFinancialData.financialScore || 650}**. \n\nTo improve this, I recommend:\n1. Increasing your savings ratio from **${userFinancialData.savingsRatio || 0}%** to at least 20%.\n2. Completing more educational modules (currently Level ${userFinancialData.level || 1}).\n3. Consistently hitting your monthly goal targets.`;
        }

        if (lowerMsg.includes("afford") || lowerMsg.includes("car") || lowerMsg.includes("buy")) {
            const savings = parseFloat(userFinancialData.savings || 0);
            if (savings > 10000) {
                return `With **$${savings.toLocaleString()}** in savings, you have a strong foundation. However, looking at your monthly expenses of **$${userFinancialData.expenses || 0}**, buying a car right now might strain your emergency fund target of **$${userFinancialData.emergencyFundStatus?.split('$')[1] || '15,000'}**. \n\n**My advice:** Wait until your savings exceed your emergency fund plus the car down payment.`;
            }
            return `Currently, with **$${savings.toLocaleString()}** in savings, I would recommend focusing on building your emergency fund first. A car is an asset that depreciates and adds monthly insurance/fuel costs. Let's aim to hit your **${userFinancialData.emergencyFundStatus || 'emergency fund target'}** first!`;
        }

        if (lowerMsg.includes("save") || lowerMsg.includes("budget") || lowerMsg.includes("rule")) {
            return `The **50/30/20 rule** is perfect for your **$${userFinancialData.income || 0}** income. \n\n- **Needs ($${(userFinancialData.income * 0.5).toLocaleString()}):** Rent, utilities, groceries.\n- **Wants ($${(userFinancialData.income * 0.3).toLocaleString()}):** Dining out, entertainment.\n- **Savings ($${(userFinancialData.income * 0.2).toLocaleString()}):** This is your ticket to freedom! \n\nYou are currently at a **${userFinancialData.savingsRatio || 0}% savings ratio**. Try to automate a transfer of $${(userFinancialData.income * 0.2).toLocaleString()} to your savings account on payday!`;
        }

        return `Hello! As your AI Financial Mentor, I've analyzed your profile. You have an income of **$${userFinancialData.income || 0}** and a current savings of **$${userFinancialData.savings || 0}**. \n\nHow can I help you reach your goals today? You can ask me about your budget, if you can afford a specific purchase, or how to improve your financial score!`;
    }

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    const prompt = `
You are a friendly and expert financial mentor for the "Lifestyle Finance Mentor" app. 
Your goal is to provide personalized, actionable, and encouraging financial advice based on the user's data.

USER FINANCIAL PROFILE:
- Income: ${userFinancialData.income || 'Not provided'}
- Monthly Expenses: ${userFinancialData.expenses || 'Not provided'}
- Current Savings: ${userFinancialData.savings || 'Not provided'}
- Financial Score: ${userFinancialData.financialScore || 'Not calculated'}
- Savings Ratio: ${userFinancialData.savingsRatio || '0'}%
- Emergency Fund Status: ${userFinancialData.emergencyFundStatus || 'Unknown'}

ACTIVE GOALS:
${userFinancialData.goals && userFinancialData.goals.length > 0
            ? userFinancialData.goals.map(g => `- ${g.title}: ${g.current_amount}/${g.target_amount}`).join('\n')
            : 'No active goals set.'}

USER ACHIEVEMENTS:
- Level: ${userFinancialData.level || 1}
- Total XP: ${userFinancialData.xp || 0}

INSTRUCTIONS:
1. Always be supportive and professional.
2. Use the user's specific data to give advice. For example, if they ask if they can afford something, look at their expenses and savings.
3. If they ask how to improve their score, suggest specific actions like hitting their savings ratio or completing educational modules.
4. Keep responses concise but thorough.
5. Use markdown for formatting (bold, lists, etc.).

USER QUESTION:
${message}
    `;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: prompt
                            }
                        ]
                    }
                ]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Gemini API Error:", errorData);
            throw new Error("AI mentor is temporarily unavailable. Please try again.");
        }

        const data = await response.json();
        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!aiResponse) {
            throw new Error("Could not get a valid response from the AI.");
        }

        return aiResponse;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw error;
    }
}
