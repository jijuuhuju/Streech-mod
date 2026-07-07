import { initCustomBlocks, getToolboxXml } from './blocks.js';

// 画面が完全に準備できてからScratchエンジンを起動する安全な命令
window.addEventListener('DOMContentLoaded', () => {
    // 1. 本家の Virtual Machine (頭脳) を作成
    const vm = new VirtualMachine();

    // 画面を描く仕組みと、パソコンへの保存機能を合体
    vm.attachStorage(new ScratchStorage());
    vm.attachRenderer(new ScratchRender(document.createElement('canvas')));

    // 2. 本家デザインの画面を生成して組み立てる（絵文字ゼロ・本物の旗と赤ボタン）
    const guiContainer = document.getElementById('scratch-gui-root');
    const guiOptions = {
        vm: vm,
        toolboxXML: getToolboxXml(),
        hasCloudData: false
    };

    // streech専用に最適化した本物UIエディタを画面に展開
    ScratchGUI.render(guiOptions, guiContainer);

    // 3. オリジナルブロック（伸び・アラーム）の処理を登録
    initCustomBlocks(vm);
    vm.runtime._hats['streech_when_alarm_rings'] = { restartExistingThreads: true, edgeActivated: false };

    // 4. ターボモードとダークモードの処理を接続
    const turboToggle = document.getElementById('turboToggle');
    if (turboToggle) {
        turboToggle.addEventListener('change', (e) => vm.setTurboMode(e.target.checked));
    }

    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', (e) => {
            if (e.target.checked) document.body.classList.add('dark-mode');
            else document.body.classList.remove('dark-mode');
        });
    }

    // ダークモード用のスタイルファイルを自動接続
    const darkLink = document.createElement('link');
    darkLink.rel = 'stylesheet'; darkLink.href = 'css/dark.css';
    document.head.appendChild(darkLink);

    // エンジンスタート！
    vm.start();
    console.log("streechエンジンがタブレット環境で正常起動しました！");
});
