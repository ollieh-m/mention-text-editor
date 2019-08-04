import { Controller } from "stimulus"

export default class extends Controller {
	static targets = ["editor"]

	connect(){
		this.element.addEventListener("keydown", (event)=>{
			this.selection = document.getSelection()
			if (this.selection.anchorNode.parentElement.dataset.mention) {
				if (this._isSelectingFromEnd(event) || this._isSelectingFromBeginning(event)){
					event.preventDefault()
					this._selectElement(this.selection.anchorNode)
				}
			}
		})

		// TO DO: Improve this hack:
		// necessary to select mention that isn't at beginning of text area when pressing right arrow
		// keydown doesn't work because the mention is the next sibling until the cursor has moved
		this.element.addEventListener("keyup", (event)=>{
			this.selection = document.getSelection()
			if (this.selection.anchorNode.parentElement.dataset.mention && event.keyCode === 39 && this.selection.anchorOffset == 1) {
				event.preventDefault()
				this._selectElement(this.selection.anchorNode)
			}
		})
	}

	insertMention(){
		this._insertAtStart(`<span class="mention" data-mention="123">@test mention</span>&nbsp`);
		this._setCursorToEnd();
		this.editorTarget.focus();
	}

	_isSelectingFromEnd(event){
		return (event.keyCode === 37 || event.keyCode === 8) && this.selection.anchorOffset == this.selection.anchorNode.length
	}

	_isSelectingFromBeginning(event){
		return event.keyCode === 39 && this.selection.anchorOffset == 0 && this.selection.isCollapsed
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