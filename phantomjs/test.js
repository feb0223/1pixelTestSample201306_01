// node.jsと違いphantomjsでは実行ファイルを即時関数で囲まないと
// 全てグローバルスコープで定義されてしまうため、即時関数で囲む。
(function() {
var webpage = require('webpage');
var mocha = require('./lib/mocha-phantom.js').create({reporter:'spec', timeout:1000*60*5});
require('./lib/expect.js');

mocha.setup('bdd');

// テストの定義
describe('モーダルウィンドウテスト', function() {
	// pageオブジェクトを作成
	var page = webpage.create();
	// 画面のサイズを設定
	page.viewportSize = {width: 320, height: 480};
	
	// テストの前処理の記述
	before(function(done) {
		// 指定したページをオープン
		page.open('../modal_sample/index.html', function(status) {
			if (status !== 'success') {
				console.log('error!');
				phantom.exit();
				return;
			}
			// モーダル表示ボタンの位置を取得
			// page.evaluateメソッドを使ってページ内部でのJavaScript実行結果を取得できる。
			var btnClickPosition = page.evaluate(function() {
				var btnShowModal = $('#btn_show_modal').get(0);
				var rect = btnShowModal.getBoundingClientRect();
				
				var sx = (btnShowModal.screen) ? 0 : document.body.scrollLeft;
				var sy = (btnShowModal.screen) ? 0 : document.body.scrollTop;
				var position = {
					left: Math.floor(rect.left + sx),
					top: Math.floor(rect.top + sy),
					width: Math.floor(rect.width),
					height: Math.floor(rect.height)
				};
				
				return {
					left: Math.round(position.left + position.width / 2),
					top: Math.round(position.top + position.height / 2)
				};
			});
			
			// ボタンをクリックしてモーダルウィンドウを表示
			page.sendEvent('click', btnClickPosition.left, btnClickPosition.top);
			
			// Ajaxリクエストが発生するため１秒待つ
			setTimeout(function() {
				// ページのキャプチャ
				page.render('./capture/modal_capture.png');
				
				// 非同期処理の終了
				done();
			}, 1000);
		});
	});
	
	describe('表示チェック', function() {
		it('ウィンドウ', function() {
			var modalLength = page.evaluate(function() {
				return $('#main .modal').length;
			});
			expect(modalLength).to.be(1);
		});
		
		it('タイトル', function() {
			var titleText = page.evaluate(function() {
				return $('#main .modal .title').text();
			});
			expect(titleText).to.be('モーダルウィンドウテスト');
		});
		
		it('説明', function() {
			var descriptionText = page.evaluate(function() {
				return $('#main .modal .description').text();
			});
			expect(descriptionText).to.be('1pixel用のテストです。');
		});
	});
	
	after(function() {
		// PhantomJSの終了
		phantom.exit();
	});
});

// テストの実行
var runner = mocha.run();
})();