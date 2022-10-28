import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { ContactForm } from './ContactForm/ContactForm';
import { Filter } from './Filter/Filter';
import { ContactList } from './ContactList/ContactList ';
import { Container, Title, SecondTitle } from './App.styled';

const STORAGE_FORM_DATA = 'contacts';
const parsedDataFromLS = (key, initialValue = []) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? initialValue;
  } catch (error) {
    return initialValue;
  }
};

export const App = () => {
  const [contacts, setContacts] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const savedContacts = parsedDataFromLS(STORAGE_FORM_DATA);
    if (savedContacts.length === 0) {
      return;
    }
    setContacts(savedContacts);
  }, []);

  useEffect(() => {
    if (contacts.length === 0) {
      return;
    }
    localStorage.setItem(STORAGE_FORM_DATA, JSON.stringify(contacts));
  }, [contacts]);

  const checkContactsName = name => {
    const normalizedName = name.toLowerCase();
    return contacts.some(({ name }) => normalizedName === name.toLowerCase());
  };

  const addContact = newContact => {
    const { name, number } = newContact;
    if (checkContactsName(name)) {
      alert(`${name} is already in contacts.`);
      return;
    }

    const contact = {
      id: nanoid(),
      name,
      number,
    };

    setContacts(prevContacts => [contact, ...prevContacts]);
  };

  const changeFilter = e => {
    setFilter(e.currentTarget.value);
  };

  const getContactsByName = () => {
    const normalizedFilter = filter.toLowerCase();

    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(normalizedFilter)
    );
  };

  const deleteContact = contactId => {
    setContacts(prevContacts =>
      prevContacts.filter(contact => contact.id !== contactId)
    );
  };

  return (
    <Container>
      <Title>Phonebook</Title>
      <ContactForm onSubmit={addContact} />

      <SecondTitle>Contacts</SecondTitle>
      {contacts.length > 0 && (
        <>
          <Filter value={filter} onChange={changeFilter} />
          <ContactList
            contacts={getContactsByName()}
            onDeleteContact={deleteContact}
          />
        </>
      )}
      {contacts.length === 0 && <p>There is no contacts</p>}
    </Container>
  );
};

// export class App extends Component {
//   state = {
//     contacts: [],
//     filter: '',
//   };

//   componentDidMount() {
//     const contacts = parsedDataFromLS(STORAGE_FORM_DATA);
//     this.setState({ contacts });
//   }

//   componentDidUpdate(_, prevState) {
//     const prevContacts = prevState.contacts;
//     const nextContacts = this.state.contacts;

//     if (nextContacts !== prevContacts) {
//       localStorage.setItem(STORAGE_FORM_DATA, JSON.stringify(nextContacts));
//     }
//   }

//   addContact = newContact => {
//     const { name, number } = newContact;
//     if (this.checkContactsName(name)) {
//       alert(`${name} is already in contacts.`);
//       return;
//     }

//     const contact = {
//       id: nanoid(),
//       name,
//       number,
//     };

//     this.setState(prevState => ({
//       contacts: [contact, ...prevState.contacts],
//     }));
//   };

//   changeFilter = e => {
//     this.setState({ filter: e.currentTarget.value });
//   };

//   getContactsByName = () => {
//     const { filter, contacts } = this.state;
//     const normalizedFilter = filter.toLowerCase();

//     return contacts.filter(contact =>
//       contact.name.toLowerCase().includes(normalizedFilter)
//     );
//   };

//   checkContactsName = name => {
//     const { contacts } = this.state;
//     const normalizedName = name.toLowerCase();
//     return contacts.some(({ name }) => normalizedName === name.toLowerCase());
//   };

//   deleteContact = contactId => {
//     this.setState(prevState => ({
//       contacts: prevState.contacts.filter(contact => contact.id !== contactId),
//     }));
//   };

//   render() {
//     const { filter, contacts } = this.state;
//     const filteredContacts = this.getContactsByName();
//     return (
//       <Container>
//         <Title>Phonebook</Title>
//         <ContactForm onSubmit={this.addContact} />

//         <SecondTitle>Contacts</SecondTitle>
//         {contacts.length > 0 && (
//           <>
//             <Filter value={filter} onChange={this.changeFilter} />
//             <ContactList
//               contacts={filteredContacts}
//               onDeleteContact={this.deleteContact}
//             />
//           </>
//         )}
//         {contacts.length === 0 && <p>There is no contacts</p>}
//       </Container>
//     );
//   }
// }
