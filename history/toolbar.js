// Manages the toolbar buttons


const Toolbar = {

	// Toolbar buttons
	_buttons: {
		'select': document.getElementById('select-all'),
		'copy': document.getElementById('copy-selected'),
		'delete': document.getElementById('delete-selected'),
		'export': document.getElementById('export-selected')
	},


	// All button listeners
	init: function() {
		for(let b in this._buttons) {
			this._buttons[b].addEventListener('click', (event) => {
				Toolbar.click(b, event);
			});
		}
	},


	// Toolbar button actions
	click: function(button, event) {
		let selected = CitationManager.getSelected();

		switch(button) {

			// Select / deselect citations in the active tab
			case 'select':
				if(CitationManager._allSelected) CitationManager.deselectAll();
				else CitationManager.selectAll();
			break;

			// Copy selected citations
			case 'copy':
				// Don't copy if no citations are selected
				if(!selected.citations.length) break;

				let copyString = "";

				// Append to string
				for(let e in selected.elements) {
					let name = selected.elements[e].querySelector('pre');

					copyString += name.innerText + '\n\n';
				}

				// Copy to clipboard
				navigator.clipboard.writeText(
					copyString.trimEnd()
				).catch(alert);
			break;

			// Delete selected citations
			case 'delete':
				 // Check if any citations are selected
        if (!selected.citations.length) {
          alert("No citations selected for deletion.");
          return;
        }

        // Confirm the delete action with the user
        if (confirm("Are you sure you want to delete the selected citations?")) {
          // Loop through selected elements and remove them from the DOM
          selected.elements.forEach(element => {
            // Remove the element from the DOM
            element.remove();
          });

          // Optionally, call a method on CitationManager to remove the citations from the model
          CitationManager.removeSelected(); // Assuming this function exists to update the citation state
        }
			break;

			// Export selected citations
			case 'export':
				if(!selected.citations.length) return;

				let historyString = HistoryFormatter.export({
					citations: selected.citations,
					containers: [] // TODO
				});

				historyString = "data:text/chf," + historyString;

				chrome.downloads.download({
					url: historyString,
					filename: "history.chf"
				});
			break;

		}
	}

};
