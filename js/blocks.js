// 💡 streech オリジナルのブロックを定義するファイル

export function initCustomBlocks(vm) {
    // 1. 【伸びブロック】の見た目と設定
    Blockly.Blocks['streech_stretch_xy'] = {
        init: function() {
            this.jsonInit({
                "message0": "%1 方向に %2 ％伸ばす",
                "args0": [
                    {"type": "field_dropdown", "name": "DIRECTION", "options": [["横", "X"], ["縦", "Y"]]},
                    {"type": "input_value", "name": "PERCENT"}
                ],
                "category": "looks",
                "extensions": ["colours_looks", "shape_statement"]
            });
        }
    };

    // 伸びブロックが実行されたときの処理
    vm.runtime._primitives['streech_stretch_xy'] = function(args, util) {
        const direction = args.DIRECTION;
        const percent = Number(args.PERCENT);
        const target = util.target;
        if (!target) return;
        if (!target.streechScale) target.streechScale = { x: 100, y: 100 };
        if (direction === 'X') target.streechScale.x = percent;
        else if (direction === 'Y') target.streechScale.y = percent;
        if (target.drawableID) {
            vm.runtime.renderer.updateDrawableProperties(target.drawableID, {
                scale: [target.streechScale.x, target.streechScale.y]
            });
        }
    };

    // 2. 【アラームをセットするブロック】の見た目と設定
    Blockly.Blocks['streech_set_alarm'] = {
        init: function() {
            this.jsonInit({
                "message0": "%1 秒後に %2 を鳴らす",
                "args0": [
                    { "type": "input_value", "name": "SECONDS" },
                    {"type": "field_dropdown", "name": "ALARM_NAME", "options": [["アラーム1", "ALARM1"], ["アラーム2", "ALARM2"]]}
                ],
                "category": "control",
                "extensions": ["colours_control", "shape_statement"]
            });
        }
    };

    // アラームセット時の実行処理
    vm.runtime._primitives['streech_set_alarm'] = function(args, util) {
        const seconds = Number(args.SECONDS);
        const alarmName = args.ALARM_NAME;
        setTimeout(() => {
            vm.runtime.startHats('streech_when_alarm_rings', { ALARM_NAME: alarmName });
        }, seconds * 1000);
    };

    // 3. 【アラームが鳴ったとき（ハットブロック）】の見た目と設定
    Blockly.Blocks['streech_when_alarm_rings'] = {
        init: function() {
            this.jsonInit({
                "message0": "アラーム %1 が鳴ったとき",
                "args0": [
                    {"type": "field_dropdown", "name": "ALARM_NAME", "options": [["アラーム1", "ALARM1"], ["アラーム2", "ALARM2"]]}
                ],
                "category": "event",
                "extensions": ["colours_event", "shape_hat"]
            });
        }
    };
}

// 💻 左側のメニュー（ツールボックス）に並べるブロックの設計図
export function getToolboxXml() {
    return `
    <xml id="toolbox" style="display: none">
        <category name="見た目" id="looks" colour="#9966FF">
            <block type="streech_stretch_xy">
                <value name="PERCENT"><shadow type="math_number"><field name="NUM">150</field></shadow></value>
            </block>
        </category>
        <category name="イベント" id="events" colour="#FFD12A">
            <block type="streech_when_alarm_rings"></block>
        </category>
        <category name="制御" id="control" colour="#FFAB19">
            <block type="streech_set_alarm">
                <value name="SECONDS"><shadow type="math_number"><field name="NUM">5</field></shadow></value>
            </block>
        </category>
    </xml>
    `;
}
