import { Info, Heart, Eye, Compass, Minus } from 'lucide-react';
import SubscribeForm from '@/components/SubscribeForm';

const principles = [
  {
    icon: Eye,
    title: '觉察是改变的开始',
    desc: '我们相信，真正的改变不源于强迫和意志力，而源于对自己念头、情绪和行为的清晰觉察。记录，是觉察的工具。',
  },
  {
    icon: Minus,
    title: '下限思维，而非上限',
    desc: '不追求每篇日记都是"深度好文"。哪怕每天只写一句话，也比空白强。持续高于完美，频率高于强度。',
  },
  {
    icon: Compass,
    title: '记录代替打卡',
    desc: '这里没有积分、排行榜或连续天数惩罚。休日是被尊重的。我们关注的是你在记录中获得的觉察，而非数字。',
  },
  {
    icon: Heart,
    title: '为自己而写',
    desc: '没有点赞，没有关注，没有算法。这是一个真正属于你自己的空间。你的日记只有你能看到。',
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-reading mx-auto space-y-12">
      {/* Hero */}
      <section className="text-center py-10">
        <span className="text-4xl block mb-4">🌙</span>
        <h1 className="text-2xl sm:text-3xl font-heading font-medium text-ink dark:text-[#E8E6E3] mb-3">
          关于觉醒日志
        </h1>
        <p className="text-sm text-ink-muted dark:text-[#9A9A9E] max-w-sm mx-auto leading-relaxed">
          一个安静的个人觉察空间。建于 2025 年，源于一段关于认知觉醒的旅程。
        </p>
      </section>

      {/* Personal story */}
      <section className="bg-white dark:bg-deep-800 rounded-2xl p-6 sm:p-8 border border-warm-200 dark:border-deep-700">
        <h2 className="text-lg font-heading font-medium mb-4 flex items-center gap-2">
          <Info size={18} className="text-sage-500" />
          为什么创建觉醒日志
        </h2>
        <div className="prose-reading text-sm text-ink-muted dark:text-[#9A9A9E] leading-relaxed space-y-4">
          <p>
            几年前，我和大多数人一样，活在一台"自动驾驶仪"上。被多巴胺驱动的短视频吞噬时间，在与他人的比较中消耗情绪，对财富的焦虑如影随形——却从未真正停下来，观察过自己的内心。
          </p>
          <p>
            直到我读到《认知觉醒》。书里有一句话让我久久无法平静：<strong className="text-ink dark:text-[#E8E6E3]">"人与人之间最大的差距，是元认知能力的差距。"</strong>
          </p>
          <p>
            我开始尝试每天写觉察日记。不是流水账，也不是情绪宣泄，而是诚实地问自己：今天，我被什么情绪支配了？我在哪个瞬间做了有意识的选择？我的注意力被什么偷走了？
          </p>
          <p>
            这个习惯改变了我。慢慢地，我发现自己从"被生活推着走"变成了"有意识地活着"。于是，我建造了这个小小的空间——觉醒日志。它属于每一个愿意每天停下来、觉察自己的人。
          </p>
          <p className="text-sage-500 dark:text-sage-400 font-medium">
            觉察，是改变的开始。
          </p>
        </div>
      </section>

      {/* Core principles */}
      <section className="bg-white dark:bg-deep-800 rounded-2xl p-6 sm:p-8 border border-warm-200 dark:border-deep-700">
        <h2 className="text-lg font-heading font-medium mb-6">核心理念</h2>
        <div className="space-y-5">
          {principles.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="flex gap-4">
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-sage-50 dark:bg-sage-500/10 flex items-center justify-center">
                  <Icon size={18} className="text-sage-500 dark:text-sage-400" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-ink dark:text-[#E8E6E3] mb-1">
                    {p.title}
                  </h3>
                  <p className="text-xs text-ink-muted dark:text-[#9A9A9E] leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Subscribe */}
      <section className="bg-white dark:bg-deep-800 rounded-2xl p-6 sm:p-8 border border-warm-200 dark:border-deep-700">
        <h2 className="text-lg font-heading font-medium mb-2">📬 订阅觉醒周报</h2>
        <p className="text-sm text-ink-muted dark:text-[#9A9A9E] mb-4">
          每周一封邮件，分享觉醒心得、认知科学精华和实践方法。不打扰，可随时退订。
        </p>
        <SubscribeForm />
      </section>
    </div>
  );
}
