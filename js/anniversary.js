document.addEventListener('DOMContentLoaded', () => {
    const loveStartDate = new Date('2024-02-23T00:00:00');
    const acquaintanceStartDate = new Date('2023-08-24T00:00:00');

    const loveCounter = document.getElementById('love-counter');
    const acquaintanceCounter = document.getElementById('acquaintance-counter');
    const loveMilestonesContainer = document.getElementById('love-milestones');
    const acquaintanceMilestonesContainer = document.getElementById('acquaintance-milestones');
    const formatButtons = document.querySelectorAll('.time-format-switcher button');

    let currentFormat = 'days';
    let timerInterval = null;

    const milestones = [
        { days: 100, label: '100天' }, { days: 200, label: '200天' }, { days: 300, label: '300天' },
        { years: 1, label: '一周年' }, { days: 400, label: '400天' }, { days: 500, label: '500天' },
        { days: 600, label: '600天' }, { days: 700, label: '700天' }, { years: 2, label: '两周年' },
        { days: 800, label: '800天' }, { days: 900, label: '900天' }, { days: 1000, label: '1000天' },
        { years: 3, label: '三周年' }, { years: 4, label: '四周年' }, { years: 5, label: '五周年' },
        { years: 6, label: '六周年' }
    ];
    for (let i = 7; i <= 100; i++) {
        milestones.push({ years: i, label: `${i}周年` });
    }

    function calculateDate(startDate, milestone) {
        const date = new Date(startDate);
        if (milestone.days) {
            date.setDate(date.getDate() + milestone.days);
        }
        if (milestone.years) {
            date.setFullYear(date.getFullYear() + milestone.years);
        }
        return date;
    }

    function formatDuration(ms) {
        const s = Math.floor(ms / 1000);
        const m = Math.floor(s / 60);
        const h = Math.floor(m / 60);
        const d = Math.floor(h / 24);

        switch (currentFormat) {
            case 'days': return `${d}天`;
            case 'months': return `${(d / 30.44).toFixed(2)}月`;
            case 'years': return `${(d / 365.25).toFixed(2)}年`;
            case 'full': return `${d}天 ${h % 24}小时 ${m % 60}分钟 ${s % 60}秒`;
        }
    }

    function updateAll() {
        const now = new Date();
        loveCounter.textContent = formatDuration(now - loveStartDate);
        acquaintanceCounter.textContent = formatDuration(now - acquaintanceStartDate);
        renderMilestones(); // Also re-render milestones
    }

    function renderMilestones() {
        const now = new Date();
        loveMilestonesContainer.innerHTML = '';
        acquaintanceMilestonesContainer.innerHTML = '';

        milestones.forEach(milestone => {
            // Love milestones
            const loveMilestoneDate = calculateDate(loveStartDate, milestone);
            createMilestoneCard(loveMilestonesContainer, milestone.label, loveMilestoneDate, now);

            // Acquaintance milestones
            const acquaintanceMilestoneDate = calculateDate(acquaintanceStartDate, milestone);
            createMilestoneCard(acquaintanceMilestonesContainer, milestone.label, acquaintanceMilestoneDate, now);
        });
    }

    function createMilestoneCard(container, label, milestoneDate, now) {
        const diff = milestoneDate - now;
        const card = document.createElement('div');
        card.className = 'anniversary-card';

        const daysDiff = Math.ceil(diff / (1000 * 60 * 60 * 24));

        if (diff < 0) {
            card.classList.add('past');
            card.innerHTML = `<h3>${label}</h3><p>已经过去 ${formatDuration(-diff)}</p>`;
        } else {
            card.classList.add('future');
            if (daysDiff === 0) {
                card.innerHTML = `<h3>${label}</h3><p>就是今天</p>`;
            } else {
                card.innerHTML = `<h3>${label}</h3><p>还有 ${formatDuration(diff)}</p>`;
            }
        }
        container.appendChild(card);
    }

    function startTimer() {
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(updateAll, 1000);
    }



    formatButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentFormat = button.dataset.format;
            formatButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            updateAll();
        });
    });

    // Initial setup
    formatButtons[0].classList.add('active');
    updateAll(); // Corrected function call
    startTimer(); // Start the timer on page load

});