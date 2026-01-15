import { GoogleGenAI } from "@google/genai";
import { Nutrients, CowParameters } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const predictMetabolicHealth = async (
  cowParams: CowParameters,
  needs: Nutrients,
  supplied: Nutrients,
  forageToConcRatio: number
): Promise<string> => {
  const model = "gemini-3-flash-preview";

  const prompt = `
    أنت طبيب بيطري وخبير تغذية أبقار. قم بتحليل هذه العليقة وتوقع الأمراض الاستقلابية المحتملة.
    
    بيانات البقرة:
    الوزن: ${cowParams.weight} كغ
    انتاج الحليب: ${cowParams.milkProduction} كغ
    الحمل: شهر ${cowParams.pregnancyMonth}
    
    الاحتياجات مقابل المقدم:
    الطاقة: المقدم ${supplied.me} Mcal (${(supplied.me * 4.184).toFixed(1)} MJ) / المطلوب ${needs.me} Mcal (${(needs.me * 4.184).toFixed(1)} MJ)
    البروتين (g): المقدم ${supplied.cp} / المطلوب ${needs.cp}
    الكالسيوم (g): المقدم ${supplied.ca} / المطلوب ${needs.ca}
    الفوسفور (g): المقدم ${supplied.p} / المطلوب ${needs.p}
    
    نسبة العلف المالك للمركز تقريباً: ${forageToConcRatio.toFixed(2)}
    
    المطلوب:
    1. هل هناك خطر للإصابة بالحماض الكرشي (Acidosis)؟ لماذا؟
    2. هل هناك خطر للكيتوزيس (Ketosis)؟
    3. هل هناك خطر لحمى الحليب (Milk Fever)؟
    4. نصيحة قصيرة واحدة لتحسين العليقة.
    
    أجب باللغة العربية بأسلوب علمي ومختصر.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text || "لم يتمكن النظام من توليد تحليل حالياً.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "عذراً، حدث خطأ أثناء الاتصال بخدمة الذكاء الاصطناعي.";
  }
};