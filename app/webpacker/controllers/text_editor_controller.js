import { Controller } from "stimulus"

export default class extends Controller {
	static targets = ["editor", "input"]

	connect(){
		this.element.addEventListener("keydown", (event)=>{
			this.selection = document.getSelection()
			
			if (this._isSelectingMentionFromAfter(event) || this._isSelectingMentionFromBeginning(event)){
				event.preventDefault()
				this._selectElement(this.selection.anchorNode)
			} else if (this._isSelectingMentionFromBefore(event)) {
				event.preventDefault()
				this._selectElement(this.selection.anchorNode.nextSibling.firstChild)
			}
		})
	}

	updateInput(){
		this._updateInput();
	}

	insertMention(){
		this._insertAtStart(`<span class="mention" data-mention="123">@test mention</span>&nbsp`);
		this._updateInput();
		this._setCursorToEnd();
		this.editorTarget.focus();
	}

	_updateInput(){
		var nodesArray = [...this.editorTarget.childNodes]
		this.inputTarget.value = nodesArray.map((node)=>{
			if (node.dataset && node.dataset.mention) {
				return `[${node.textContent}](${node.dataset.mention})`
			} else {
				return node.textContent
			}
		}).join('')
	}

	_isSelectingMentionFromAfter(event){
		if (event.keyCode === 37 || event.keyCode === 8) {
			if (this.selection.anchorNode.parentElement.dataset.mention) {
				return this.selection.anchorOffset == this.selection.anchorNode.length
			}
		}
	}

	_isSelectingMentionFromBeginning(event){
		if (event.keyCode === 39) {
			if (this.selection.anchorNode.parentElement.dataset.mention) {
				return this.selection.anchorOffset == 0 && this.selection.isCollapsed
			}
		}
	}

	_isSelectingMentionFromBefore(event){
		if (event.keyCode === 39) {
			if (this.selection.anchorNode.nextSibling && this.selection.anchorNode.nextSibling.dataset && this.selection.anchorNode.nextSibling.dataset.mention) {
				return this.selection.anchorOffset == this.selection.anchorNode.length
			}
		}
	}

	_selectElement(element){
		var range = document.createRange()
		range.setStart(element, 0)
		range.setEnd(element, element.length)
		var selection = document.getSelection()
		selection.removeAllRanges()
		selection.addRange(range)
	}

	_insertAtStart(html){
		var range = document.createRange();
		range.setStart(this.editorTarget, 0);
		range.collapse(true);
		var fragment = this._createFragment(html);
		range.insertNode(fragment);
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