import React from 'react';
import { ShieldCheck, FlaskConical, BatteryCharging, Droplets, Zap, Activity, HeartPulse, Scale, Beaker, Droplet, ClipboardList, Wheat } from 'lucide-react';

// FIX: Define props with an interface and use React.FC for better type checking.
interface GuidanceCardProps {
    title: string;
    icon: React.ElementType;
    children: React.ReactNode;
}

const GuidanceCard: React.FC<GuidanceCardProps> = ({ title, icon: Icon, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 print-break-inside-avoid">
        <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-100 text-emerald-700 p-3 rounded-full">
                <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">{title}</h3>
        </div>
        <div className="space-y-4 text-slate-600">
            {children}
        </div>
    </div>
);

// FIX: Define props with an interface and use React.FC for better type checking. This resolves the incorrect "missing children" errors.
interface RecommendationItemProps {
    title: string;
    icon: React.ElementType;
    children: React.ReactNode;
}

const RecommendationItem: React.FC<RecommendationItemProps> = ({ title, icon: Icon, children }) => (
    <div>
        <h4 className="font-bold text-emerald-800 flex items-center gap-2 mb-1">
            <Icon className="w-5 h-5" />
            <span>{title}</span>
        </h4>
        <p className="text-sm">{children}</p>
    </div>
);

const Guidance = () => {
    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-slate-800">إرشادات عامة وتوصيات حول المكملات العلفية</h2>
                <p className="mt-2 max-w-2xl mx-auto text-slate-600">
                    دليل سريع لتحسين صحة وإنتاجية الأبقار الحلوب من خلال التغذية الدقيقة والوقاية من الاضطرابات الاستقلابية الشائعة في مختلف مراحل الإنتاج.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <GuidanceCard title="فترة الجفاف (قبل 60-21 يوم من الولادة)" icon={ShieldCheck}>
                    <p className="font-medium text-slate-700">الهدف الرئيسي: تهيئة الكرش والجهاز المناعي للبقرة للولادة وموسم الإدرار القادم، ومنع حمى الحليب.</p>
                    <RecommendationItem title="الأملاح الأنيونية (Anionic Salts)" icon={FlaskConical}>
                        تستخدم في آخر 21 يوم قبل الولادة لخلق حماض دم استقلابي خفيف، مما يحفز تعبئة الكالسيوم من العظام ويمنع حمى الحليب. يجب مراقبة pH البول ليكون بين 6.2-6.8.
                    </RecommendationItem>
                    <RecommendationItem title="تقليل الكالسيوم في العليقة" icon={Beaker}>
                        خفض مستوى الكالسيوم (أقل من 50 غرام/يوم) لتنشيط آليات تعبئة الكالسيوم في الجسم استعداداً للطلب العالي عليه بعد الولادة.
                    </RecommendationItem>
                </GuidanceCard>
                
                <GuidanceCard title="الفترة الانتقالية (حول الولادة)" icon={HeartPulse}>
                     <p className="font-medium text-slate-700">الهدف الرئيسي: دعم توازن الطاقة السلبي الحاد، منع الكيتوزيس (Ketosis) وحمى الحليب (Milk Fever).</p>
                    <RecommendationItem title="مصدر طاقة سريعة (Energy Boosters)" icon={BatteryCharging}>
                        <b>بروبيلين جليكول:</b> تجريع فموي بعد الولادة مباشرة لرفع جلوكوز الدم ومنع الكيتوزيس.
                    </RecommendationItem>
                    <RecommendationItem title="النياسين (Niacin - Vit B3)" icon={Activity}>
                         يساعد في تقليل تحلل دهون الجسم ويقلل من خطر الكيتوزيس وتكون الأجسام الكيتونية.
                    </RecommendationItem>
                    <RecommendationItem title="الكولين المحمي (Protected Choline)" icon={Zap}>
                        يحسن وظائف الكبد ويساعد في تصدير الدهون منه، مما يقلل من خطر الكبد الدهني (Fatty Liver).
                    </RecommendationItem>
                </GuidanceCard>
                
                <GuidanceCard title="بداية موسم الإدرار (21-100 يوم)" icon={Zap}>
                    <p className="font-medium text-slate-700">الهدف الرئيسي: دعم إنتاج الحليب المرتفع، تقليل خطر الحماض الكرشي (Acidosis) بسبب زيادة المركزات.</p>
                    <RecommendationItem title="منظمات حموضة الكرش (Buffers)" icon={Droplets}>
                        <b>بيكربونات الصوديوم وأكسيد المغنيسيوم:</b> تساعد في استقرار pH الكرش عند استخدام علائق غنية بالنشويات والسكريات.
                    </RecommendationItem>
                    <RecommendationItem title="خمائر حية (Live Yeast)" icon={Wheat}>
                        تحسن بيئة الكرش، تزيد من هضم الألياف، وتساعد في استقرار pH الكرش عن طريق استهلاك حمض اللاكتيك.
                    </RecommendationItem>
                     <RecommendationItem title="الدهون المحمية (Bypass Fats)" icon={Zap}>
                        مصدر طاقة مركز لا يتخمر في الكرش، مما يزيد كثافة الطاقة في العليقة دون زيادة خطر الحماض.
                    </RecommendationItem>
                </GuidanceCard>

                <GuidanceCard title="ذروة ومنتصف موسم الإدرار" icon={Activity}>
                    <p className="font-medium text-slate-700">الهدف الرئيسي: الحفاظ على إنتاجية عالية، دعم الخصوبة، والحفاظ على الحالة الجسمانية.</p>
                     <RecommendationItem title="أحماض أمينية محمية" icon={Zap}>
                       <b>الميثيونين والليسين:</b> لتحسين إنتاج بروتين الحليب، دعم وظائف الكبد والمناعة، وتحسين الخصوبة.
                    </RecommendationItem>
                     <RecommendationItem title="البيوتين (Biotin)" icon={Zap}>
                        يدعم صحة الحافر وقوته، ويحسن استقلاب الطاقة.
                    </RecommendationItem>
                </GuidanceCard>

                <GuidanceCard title="نهاية موسم الإدرار وبداية الجفاف" icon={Scale}>
                    <p className="font-medium text-slate-700">الهدف الرئيسي: استعادة شرط الجسم (BCS) وتجنب السمنة المفرطة.</p>
                    <RecommendationItem title="تقليل المركزات" icon={Wheat}>
                        خفض كمية المركزات تدريجياً لتجنب زيادة وزن البقرة بشكل مفرط، مما يسبب مشاكل عند الولادة التالية.
                    </RecommendationItem>
                     <RecommendationItem title="مراقبة شرط الجسم (BCS)" icon={Scale}>
                        الهدف هو الوصول لـ BCS بين 3.25 - 3.75 عند التجفيف لضمان ولادة سهلة وبداية موسم جيدة.
                    </RecommendationItem>
                </GuidanceCard>
                
                <GuidanceCard title="توصيات عامة دائمة" icon={ClipboardList}>
                     <p className="font-medium text-slate-700">الأساسيات التي تضمن نجاح أي برنامج تغذية.</p>
                    <RecommendationItem title="الماء النظيف" icon={Droplet}>
                        يجب توفير مياه نظيفة وعذبة باستمرار وبكميات غير محدودة، فالماء هو العنصر الغذائي الأهم.
                    </RecommendationItem>
                     <RecommendationItem title="الأملاح والفيتامينات (Premixes)" icon={Beaker}>
                       استخدام بريمكسات ذات جودة عالية ومتوازنة لتغطية جميع احتياجات العناصر النادرة والفيتامينات.
                    </RecommendationItem>
                     <RecommendationItem title="جودة الخلط (TMR)" icon={ClipboardList}>
                        التأكد من خلط العليقة بشكل جيد ومتجانس لتجنب الفرز والاختيار من قبل الأبقار وضمان حصول كل بقرة على عليقة متوازنة.
                    </RecommendationItem>
                </GuidanceCard>
            </div>
            
             <div className="mt-8 bg-yellow-50 p-4 rounded-lg text-sm text-yellow-800 border border-yellow-200 text-center">
                <b>تنويه هام:</b> هذه الإرشادات هي توصيات عامة. يجب دائماً استشارة خبير تغذية أو طبيب بيطري لتصميم برنامج مكملات يناسب ظروف قطيعك وموارده العلفية المتاحة.
            </div>
        </div>
    );
};

export default Guidance;