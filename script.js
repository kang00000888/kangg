/* ==========================================================================
   康选臣 · 个人技术主页脚本
   功能：
   1. 导航栏当前项高亮
   2. 滚动进入视口时的淡入动画
   3. 数字助手（内嵌，模拟对话）
   ========================================================================== */

(function () {
  'use strict';

  /* ----------------------------------------------------------------------
     1. 导航栏当前项高亮
  ---------------------------------------------------------------------- */
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    const scrollPos = window.scrollY + 80;
    let currentId = 'home';

    sections.forEach((section) => {
      if (section.offsetTop <= scrollPos) {
        currentId = section.id;
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', href === currentId);
    });
  }

  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav();

  /* ----------------------------------------------------------------------
     2. 滚动进入视口时的淡入动画
  ---------------------------------------------------------------------- */
  const revealEls = document.querySelectorAll(
    '.skill-card, .project-card, .dev-item, .about-text, .timeline-item, .workflow-step'
  );

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('revealed'));
  }

  /* ----------------------------------------------------------------------
     3. 数字助手（内嵌模拟对话）
  ---------------------------------------------------------------------- */
  const assistant = (function () {
    const messagesBox = document.getElementById('assistantMessages');
    const form = document.getElementById('assistantForm');
    const input = document.getElementById('assistantInput');
    const suggestionBox = document.getElementById('assistantSuggestions');

    // 知识库：关键词 -> 回答（按匹配到的关键词总长度计分，取最高分）
    const knowledge = [
      {
        keywords: [
          '你是谁', '你好', '您好', '嗨', 'hello', 'hi', '在吗',
          '自我介绍', '介绍一下你', '认识一下', '叫什么', '名字', '姓名'
        ],
        answer:
          '你好！我是康选臣的数字助手。\n\n康选臣是上海师范大学计算机科学与技术专业的大三本科生，我可以为你介绍他的专业、技能、项目、开发环境和联系方式。'
      },
      {
        keywords: [
          '专业', '学校', '大学', '年级', '大几', '本科', '学什么',
          '哪所', '上师大', '上海师范', '计算机科学', '多大', '年龄', '几岁'
        ],
        answer:
          '他目前就读于上海师范大学，专业是计算机科学与技术，现在是本科大三。'
      },
      {
        keywords: [
          '技术', '技能', '会什么', '会哪些', '掌握', '语言', '编程',
          '前端', '后端', '技术栈', 'python', 'java', 'javascript',
          'c++', 'c语言', 'c/c++', 'flask', 'django', 'mysql', 'sqlite'
        ],
        answer:
          '他掌握的技术包括：\n\n· 编程语言：Python、Java、JavaScript、C/C++\n· 前端：HTML5、CSS3、JavaScript、Bootstrap、ECharts\n· 后端：Python Flask、Django 基础、MySQL、SQLite\n· 数据处理：Pandas、数据可视化、数据分析\n· 工具：Git/GitHub、VS Code、Trae'
      },
      {
        keywords: ['项目', '做过', '经历', '作品', '实践', '作品集', 'project'],
        answer:
          '他参与过三个主要项目：\n\n1. 数据可视化分析系统（课程实践）\n   Python + Pandas + ECharts\n\n2. 电商数据采集与分析平台（个人实践）\n   Python + Scrapy + MongoDB + Flask\n\n3. Arduino 智能硬件交互系统（课程实践）\n   Arduino Uno + C/C++'
      },
      {
        keywords: [
          '联系', '邮箱', '邮件', 'github', '怎么找', '联系方式',
          '如何联系', '怎么联系', '微信', 'qq', '加我'
        ],
        answer:
          '你可以通过以下方式联系他：\n\n· 邮箱：kang000008@qq.com\n· GitHub：github.com/kang00000888'
      },
      {
        keywords: ['开发环境', '环境', 'ide', 'llm', 'deepseek', 'trae', '用什么开发', '开发工具'],
        answer:
          '我的主页基于 Trae 开发，使用 Trae Agent 辅助编码，结合 DeepSeek-V4-Pro 完成开发，并通过 GitHub 进行版本管理。'
      },
      {
        keywords: ['开发流程', '开发方式', '开发步骤', '怎么开发', '如何开发', '流程'],
        answer:
          '我的主页采用 Trae 作为 AI 开发环境，使用 Trae Agent 辅助代码设计，结合 DeepSeek-V4-Pro 完成开发，通过 GitHub 进行版本管理和部署。'
      },
      {
        keywords: [
          '数据', '可视化', '爬虫', 'arduino', '硬件', '电商',
          'scrapy', 'pandas', 'echarts', 'mongodb'
        ],
        answer:
          '他在这几个方向都有实践：数据可视化（ECharts + Pandas）、爬虫采集（Scrapy）、以及 Arduino 智能硬件交互（C/C++）。想了解具体项目细节可以问我「你做过哪些项目？」。'
      },
      {
        keywords: ['兴趣', '爱好', '方向', '目标', '关注', '喜欢', '规划', '未来', '打算', '职业', '就业'],
        answer:
          '他目前关注 Web 开发、数据处理与可视化、智能交互等方向，通过课程实验与个人项目不断积累工程实践经验。'
      },
      {
        keywords: ['学习方向', '发展方向', '主攻方向', '学什么方向', '研究什么', '学哪方面'],
        answer:
          '目前主要关注 Web 开发、数据分析以及 AI 应用方向，希望通过项目实践提升软件工程能力。'
      },
      {
        keywords: ['课程', '学了', '科目', '专业课', '学过', '课程安排', '软件工程', '数据库', '计算机网络'],
        answer:
          '他系统学习过软件工程、程序设计、数据库原理、计算机网络等课程，具备较好的程序设计基础和软件开发实践能力。'
      },
      {
        keywords: ['谢谢', '感谢', '再见', '拜拜', 'bye', '辛苦'],
        answer: '不客气！有其它问题随时问我，祝学习顺利～'
      }
    ];

    // 未命中时的友好兜底，给出可聊话题而不是生硬回避
    function fallback() {
      return (
        '这个问题我暂时还没准备专门回答～\n\n不过关于康选臣，这些我都能告诉你：\n\n' +
        '· 基本信息：你是谁\n' +
        '· 专业年级：你的专业\n' +
        '· 技术技能：你会哪些技术\n' +
        '· 项目经历：你做过哪些项目\n' +
        '· 开发环境：你的开发环境\n' +
        '· 开发流程：你的开发流程\n' +
        '· 学习方向：你的学习方向\n' +
        '· 联系方式：如何联系你\n\n' +
        '也可以直接输入关键词，比如「Python」「爬虫」「可视化」试试。'
      );
    }

    function matchAnswer(text) {
      const q = text.trim().toLowerCase();
      let best = null;
      let bestScore = 0;

      for (const item of knowledge) {
        let score = 0;
        for (const kw of item.keywords) {
          if (q.includes(kw)) {
            score += kw.length;
          }
        }
        if (score > bestScore) {
          bestScore = score;
          best = item;
        }
      }

      return best ? best.answer : fallback();
    }

    function addMessage(text, role) {
      const msg = document.createElement('div');
      msg.className = 'message ' + role;
      msg.textContent = text;
      messagesBox.appendChild(msg);
      messagesBox.scrollTop = messagesBox.scrollHeight;
      return msg;
    }

    function addTypingIndicator() {
      const typing = document.createElement('div');
      typing.className = 'message bot typing';
      messagesBox.appendChild(typing);
      messagesBox.scrollTop = messagesBox.scrollHeight;
      return typing;
    }

    function handleSend(text) {
      const question = (text || '').trim();
      if (!question) return;

      addMessage(question, 'user');
      const typing = addTypingIndicator();

      setTimeout(() => {
        typing.remove();
        addMessage(matchAnswer(question), 'bot');
      }, 500);
    }

    // 事件绑定
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const value = input.value;
      input.value = '';
      handleSend(value);
    });

    suggestionBox.addEventListener('click', (e) => {
      const btn = e.target.closest('.suggestion');
      if (btn) {
        handleSend(btn.dataset.q);
      }
    });

    // 页面加载后直接显示欢迎语
    addMessage(
      '你好！我是康选臣的数字助手。\n\n关于他的专业、技能、项目、开发环境和联系方式，尽管问我，也可以点击下方快捷提问。',
      'bot'
    );
  })();
})();
