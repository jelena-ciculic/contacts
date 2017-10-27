


class Contact{

	constructor(name,email,phoneNumber){
		this.name=name;
		this.email=email;
		this.phoneNumber=phoneNumber;
	}
}

class ContactManager{

	constructor(){

		this.listOfContacts=[];
	}

	addContact(contact){

		this.listOfContacts.push(contact);
	}

	removeContact(contact) {

		for(let i = 0; i < this.listOfContacts.length; i++) { 
			var c = this.listOfContacts[i];

			if(c.email === contact.email.trim()) {
				// remove the contact at index i
				this.listOfContacts.splice(i, 1);
				// stop/exit the loop
				break;
			}
		}
	}

	findContactByEmail(email){

		var retVal;

		for(let i = 0; i<this.listOfContacts.length; i++){

			var c = this.listOfContacts[i];

			if(c.email===email){

				retVal=c;
				break;
			}
		}


		return retVal;
	}


	empty(){

		this.listOfContacts=[];
	}


	static compareByName(c1,c2){

	
		
		if(c1.name < c2.name)
			return -1;
		if(c1.name > c2.name)
			return 1;
		return 0;
		

		
	}

	sortContacts(){

		this.listOfContacts.sort(ContactManager.compareByName);
	}



	save(){

		localStorage.contacts=JSON.stringify(this.listOfContacts);
	}


	load(){

		if(localStorage.contacts !== undefined){

			this.listOfContacts = JSON.parse(localStorage.contacts);

		}
	}

	 displayContactsAsTable(idOfContainer){

	 	var container = document.querySelector(idOfContainer);
	 	container.innerHTML="";

	 	if(this.listOfContacts.length===0){
	 		container.innerHTML="No contacts on list to display!"
	 		container.classList.add("error");
	 		return;

	 	}

		
		var table = document.createElement("table");
		var caption = document.createElement("caption");
		caption.innerHTML="Contacts"

		var input = document.createElement("input");
		input.setAttribute("type","text");
		input.setAttribute("id","searchItem");
		caption.appendChild(input);


		var findBtn = document.createElement("button");
		findBtn.setAttribute("id","searchBtn");
		findBtn.innerHTML="<i class='material-icons'>search</i>";
		findBtn.onclick=displaySearchResults;
		caption.appendChild(findBtn);
		table.appendChild(caption);

		var header = table.createTHead();
		header.innerHTML='<td><i class=material-icons>person</i></td>'+
						 '<td><i class="material-icons">email</i></td>'+
						 '<td><i class="material-icons">phone</i></td><td>options</td>';

		

		this.listOfContacts.forEach( function(current){

		var newRow = table.insertRow();

		var cell1 = newRow.insertCell();
		cell1.innerHTML = current.name;

		var cell2 = newRow.insertCell();
		cell2.innerHTML = current.email;

		var cell3 = newRow.insertCell();
		cell3.innerHTML=current.phoneNumber;

		var cell4 = newRow.insertCell();

		var delBtn = document.createElement("button");
		delBtn.addEventListener('click', function(){

			delContact(current);
		})
		delBtn.innerHTML="delete";
		cell4.appendChild(delBtn);

		var editBtn = document.createElement("button");
		editBtn.addEventListener('click', function(){

			prepForEdit(current);
		})
		editBtn.innerHTML="edit";
		cell4.appendChild(editBtn);

		})


		container.appendChild(table);

		
	}


}


window.onload=init;

var cm;

function init(){


	cm = new ContactManager();
	cm.load();
	cm.displayContactsAsTable("#contactsDiv");


	
}

function formSubmitted(){

	var name = document.querySelector("#name");
	var email = document.querySelector("#email");
	var phoneNumber =document.querySelector("#phone");

	var newContact = new Contact(name.value, email.value, phoneNumber.value);

	cm.addContact(newContact);
	name.value="";
	email.value="";
	phoneNumber.value="";
	//cm.sort()

	var div = document.querySelector("#contactsDiv");
	div.classList.remove("error");
	//cm.load();

	cm.displayContactsAsTable("#contactsDiv");


	return false;
}

function emptyList(){
	cm.empty();
	cm.displayContactsAsTable("#contactsDiv");
}

function loadList(){
	
	var div = document.querySelector("#contactsDiv");
	div.classList.remove("error");
	cm.load();
	cm.displayContactsAsTable("#contactsDiv");
}

function saveList(){
	cm.save();
}

function sortList(){

	cm.sortContacts();
	cm.displayContactsAsTable("#contactsDiv");
}

function delContact(c){

	
	
	console.log( 'person to del : ' + c.name);
	cm.removeContact(c);
	cm.displayContactsAsTable("#contactsDiv");

}

function findContact(){

	var contactToFind = document.querySelector("#searchItem").value;

	var resultList=[];

	var patt= new RegExp('^'+contactToFind,'i');
	

	for(var i =0; i<cm.listOfContacts.length; i++){

		if(patt.test(cm.listOfContacts[i].name) ||
		 	patt.test(cm.listOfContacts[i].email) || 
		 	patt.test(cm.listOfContacts[i].phoneNumber))
			resultList.push(cm.listOfContacts[i]);
	}


	return resultList;
}

function displaySearchResults(){

	var list = findContact();

	var div = document.querySelector("#contactsDiv");
	div.innerHTML="";

	if(list.length===0){
	 		div.innerHTML="No search results  on list to display!"
	 		div.classList.add("error");
	 		return;

	 	}

		
		var table = document.createElement("table");
		var caption = document.createElement("caption");
		caption.innerHTML="Contacts"
		table.appendChild(caption);

		var header = table.createTHead();
		header.innerHTML="<td>name</td><td>e-mail</td><td>phone number</td><td>actions</td>";

		list.forEach(function(current){

		var newRow = table.insertRow();

		var cell1 = newRow.insertCell();
		cell1.innerHTML = current.name;

		var cell2 = newRow.insertCell();
		cell2.innerHTML = current.email;

		var cell3 = newRow.insertCell();
		cell3.innerHTML=current.phoneNumber;

		var cell4 = newRow.insertCell();

		var delBtn = document.createElement("button");
		delBtn.addEventListener('click', function(){

			delContact(current);
		})
		delBtn.innerHTML="delete";

		cell4.appendChild(delBtn);

		var editBtn = document.createElement("button");
		editBtn.addEventListener('click', function(){

			prepForEdit(current);
		})
		editBtn.innerHTML="edit";

		cell4.appendChild(editBtn);

	

		})

		div.appendChild(table);



}


function prepForEdit(c){


	var modal = document.getElementById("id01");
	modal.style.display="block";

	var contactForEdit = cm.findContactByEmail(c.email);
	console.log("Find: " + contactForEdit.name);

	var nameEdit = document.querySelector("#nameEdit");
	var emailEdit = document.querySelector("#emailEdit");
	var phoneEdit = document.querySelector("#phoneEdit");

	nameEdit.value=c.name;
	emailEdit.value=c.email;
	phoneEdit.value=c.phoneNumber;

	



}

function editFormSubmitted(){


	
	var emailEdit = document.querySelector("#emailEdit");
	
	var elemToEdit = cm.findContactByEmail(emailEdit.value);



	var newName = document.querySelector("#newName");
	var newEmail = document.querySelector("#newEmail");
	var newPhone = document.querySelector("#newPhone");


	elemToEdit.name=newName.value;
	elemToEdit.email=newEmail.value;
	elemToEdit.phoneNumber=newPhone.value;

	console.log(elemToEdit.name);


	
	cm.displayContactsAsTable("#contactsDiv");

	

	clearFormData();


	
	return false;



}

function clearFormData(){

	var list = document.querySelector("#editForm").querySelectorAll("input");

	list.forEach(function(current){

		current.value="";
	})
}

function closeModal(){

	var modal = document.getElementById("id01");
	modal.style.display="none";

}