(function(w) {
var model = {
	getDetail: function(callback) {
		$.get('./detail.json', function(data) {
			callback(JSON.parse(data));
		});
	}
};

var View = (function() {
	/**
	 * @constructor
	 */
	function View() {
		this.main = $('#main');
		this.btnShowModal = $('#btn_show_modal');
	}
	
	View.prototype.createModalWindow = function(detail) {
		var modalWindow = $([
			'<div class="modal">',
				'<div class="modal-header">',
				'<h3 class="title"></h3>',
				'</div>',
				'<div class="modal-body">',
					'<p class="description"></p>',
				'</div>',
				'<div class="modal-footer">',
					'<button class="btn btn_close">Close</button>',
				'</div>',
			'</div>'
		].join(''));
		
		modalWindow.find('.title').append(detail.title);
		modalWindow.find('.description').append(detail.description);
		
		return modalWindow;
	};
	
	return View;
})();

$(document).ready(function() {
	var view = new View();
	
	view.btnShowModal.click(function() {
		model.getDetail(function(detail) {
			var modalWindow = view.createModalWindow(detail);
			view.main.append(modalWindow);
			
			modalWindow.find('.btn_close').click(function() {
				modalWindow.remove();
			});
		});
	});
});

})(window);