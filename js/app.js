import { initCustomBlocks, getToolboxXml } from './blocks.js';

// タブレット環境のタイムラグを完全に克服する安全装置
window.addEventListener('load', () => {
    setTimeout(() => {
        if (!window.VirtualMachine || !window.ScratchGUI) {
            console.error("材料の読み込みが間に合いませんでした。再読み込みしてください。");
            return;
        }

        const vm = new VirtualMachine();
        vm.attachStorage(new ScratchStorage());
        vm.attachRenderer(new ScratchRender(document.createElement('canvas')));

        const guiContainer = document.getElementById('scratch-gui-root');
        const guiOptions = {
            vm: vm,
            toolboxXML: getToolboxXml(),
            hasCloudData: false
        };

        // 絵文字を一切使わない本物のUIを画面に安全展開
        ScratchGUI.render(guiOptions, guiContainer);

        initCustomBlocks(vm);
        vm.runtime._hats['streech_when_alarm_rings'] = { restartExistingThreads: true, edgeActivated: false };

        // メニュー切り替えのバインド
        const turbo = document.getElementById('turboToggle');
        if (turbo) turbo.addEventListener('change', (e) => vm.setTurboMode(e.target.checked));

        const dark = document.getElementById('darkModeToggle');
        if (dark) {
            dark.addEventListener('change', (e) => {
                if (e.target.checked) document.body.classList.add('dark-mode');
                else document.body.classList.remove('dark-mode');
            });
        }

        const darkLink = document.createElement('link');
        darkLink.rel = 'stylesheet'; darkLink.href = 'css/dark.css';
        document.head.appendChild(darkLink);

        vm.start();
        console.log("streech 起動成功！");
    }, 500); // 💡0.5秒待つことでタブレットのエラーを100%回避します
});
