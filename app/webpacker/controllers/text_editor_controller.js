import { Controller } from "stimulus"

export default class extends Controller {
	static targets = ["editor"]

	insertMention(){
		this._insertAtStart(`<span class="mention" data-mention="123">@test mention</span>&nbsp`);
		this._setCursorToEnd();
		this.editorTarget.focus();
	}

	_insertAtStart(html){
		var range = document.createRange();
		range.setStart(this.editorTarget, 0);
		range.collapse(true);
		var fragment = this._createFragment(html);
		range.insertNode(fragment);
		return range;
	}

	_createFragment(html){
		var el = document.createElement("div");
    el.innerHTML = html;
    var frag = document.createDocumentFragment(), node, lastNode;
    while ( (node = el.firstChild) ) {
        lastNode = frag.appendChild(node);
    }
    var firstNode = frag.firstChild;
    return frag;
	}

	_setCursorToEnd(){
		var selection = document.getSelection();
		if (!this.editorTarget.contains(selection.baseNode)){
			var range = document.createRange();
   		var lastNode = this.editorTarget.lastChild;
   		range.setStartAfter(lastNode);
   		selection.removeAllRanges();
   		selection.addRange(range);
		}
	}
}