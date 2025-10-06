const input = document.getElementById('numberInput');
const genBtn = document.getElementById('generateBtn');
const clrBtn = document.getElementById('clearBtn');
const container = document.getElementById('blocksContainer');
const countDisplay = document.getElementById('blockCount');

let count = 0;

function genBlocks() {
    const num = parseInt(input.value);

    if (isNaN(num) || num <= 0 || num > 100) {
        alert('请输入1到100之间的有效数字');
        return;
    }

    for (let i = 0; i < num; i++) {
        const block = document.createElement('div');
        block.className = 'block';
        block.textContent = count + 1;
        block.dataset.id = count;

        block.addEventListener('click', removeBlock);
        container.appendChild(block);
        count++;
    }
    updateCount();

    input.value = '';
}

function removeBlock(e) {
    const block = e.target;

    block.classList.add('fade-out');

    setTimeout(() => {
        block.remove();
        count--;
        updateCount();
        renumber();
    }, 300);
}

function renumber() {
    const blocks = document.querySelectorAll('.block');
    blocks.forEach((block, i) => {
        block.textContent = i + 1;
        block.dataset.id = i;
    });
}

function updateCount() {
    countDisplay.textContent = count;
}

function clearAll() {
    const blocks = document.querySelectorAll('.block');

    blocks.forEach(block => {
        block.classList.add('fade-out');
    });

    setTimeout(() => {
        container.innerHTML = '';
        count = 0;
        updateCount();
    }, 300);
}

genBtn.addEventListener('click', genBlocks);
clrBtn.addEventListener('click', clearAll);

input.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        genBlocks();
    }
});

updateCount();