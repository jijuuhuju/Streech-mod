window.addEventListener('load', () => {
    console.log('CHECK: app.js 読み込み成功');

    const loader = document.getElementById('scratch-loader');

    if (!loader) {
        console.error('CHECK: scratch-loader が見つかりません');
        return;
    }

    console.log('CHECK: scratch-loader 発見');

    loader.style.display = 'none';

    console.log('CHECK: ロード画面を消しました');
});
