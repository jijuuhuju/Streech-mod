// 💡 streech のすべての機能を繋いで動かすメインプログラム

import { initCustomBlocks, getToolboxXml } from './blocks.js';

// 1. Scratchの頭脳（Virtual Machine = VM）を起動
const vm = new VirtualMachine();
const canvas = document.getElementById('stageCanvas');

// 画面を描く仕組みと、パソコンへの保存機能を合体
vm.attachStorage(new ScratchStorage());
vm.attachRenderer(new ScratchRender(canvas));

// 2. streechオリジナルのブロックデータをVMに登録
initCustomBlocks(vm);
vm.runtime._hats['streech_when_alarm_rings'] = { restartExistingThreads: true, edgeActivated: false };

// 3. 本家と同じブロック画面（Blockly）を左側に表示し、XMLを読み込む
const workspace = Blockly.inject('blocklyDiv', {
    toolbox: getToolboxXml(),
    zoom: { controls: true, wheel: true }
});
vm.attachWorkspace(workspace);

// 4. ナビゲーションバーのメニュー開閉処理
const fileMenuBtn = document.getElementById('fileMenuBtn');
const fileDropdown = document.getElementById('fileDropdown');
const settingsMenuBtn = document.getElementById('settingsMenuBtn');
const settingsDropdown = document.getElementById('settingsDropdown');

fileMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    settingsDropdown.style.display = 'none';
    fileDropdown.style.display = fileDropdown.style.display === 'block' ? 'none' : 'block';
});

settingsMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    fileDropdown.style.display = 'none';
    settingsDropdown.style.display = settingsDropdown.style.display === 'block' ? 'none' : 'block';
});

document.addEventListener('click', () => {
    fileDropdown.style.display = 'none';
    settingsDropdown.style.display = 'none';
});
settingsDropdown.addEventListener('click', (e) => e.stopPropagation());

// 5. 新規作成・PCから読込・PCへ保存の処理
document.getElementById('menuNew').addEventListener('click', () => {
    if (confirm('新しく作りますか？')) { 
        vm.clear(); 
        vm.newProject(); 
        document.getElementById('projectTitle').value = '無題のプロジェクト'; 
    }
});

const fileInput = document.getElementById('fileInput');
document.getElementById('menuLoad').addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', (e) => {
    const file = e.target.files;
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        vm.loadProject(event.target.result).then(() => { 
            document.getElementById('projectTitle').value = file.name.replace('.sb3', ''); 
        });
    };
    reader.readAsArrayBuffer(file);
});

document.getElementById('menuSave').addEventListener('click', () => {
    vm.saveProjectSb3().then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${document.getElementById('projectTitle').value || 'project'}.sb3`;
        a.click();
        URL.revokeObjectURL(url);
    });
});

// 6. 🏁ボタンと🛑ボタンの処理
document.getElementById('greenFlag').addEventListener('click', () => vm.greenFlag());
document.getElementById('stopSign').addEventListener('click', () => vm.stopAll());

// 7. ターボモードの切り替え
document.getElementById('turboToggle').addEventListener('change', (e) => vm.setTurboMode(e.target.checked));

// 8. ダークモードの切り替え
document.getElementById('darkModeToggle').addEventListener('change', (e) => {
    if (e.target.checked) document.body.classList.add('dark-mode');
    else document.body.classList.remove('dark-mode');
});

// ダークモード用のデザインファイルをリンクさせる
const darkLink = document.createElement('link');
darkLink.rel = 'stylesheet'; 
darkLink.href = 'css/dark.css';
document.head.appendChild(darkLink);

// エンジンスタート！
vm.start();
console.log("streechエンジンが正常に起動しました！");
