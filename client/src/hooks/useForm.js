import { useContext, useState } from 'react';
import UserContext from '../components/UserContext';

const useForm = (defaults) => {
  const [values, setValues] = useState(defaults);
  const [errors, setErrors] = useState([]);
  const [user, setUser] = useContext(UserContext);

  function submitForm(e) {
    e.preventDefault();
    setUser(values);
  }

  function validateFormField(e) {
    // validate input
    const { name, value } = e.target;
    const formattedValue = value.split(' ').join('');
    if (name.toLowerCase().includes('name')) {
      // validate name details
      if (formattedValue === '') {
        if (!errors.find((err) => err.message === 'First/Last Name cannot be blank')) {
          setErrors([...errors, { message: 'First/Last Name cannot be blank', field: name }]);
        }
      }
    }
    if (name.toLowerCase().includes('password')) {
      // validate password
      if (formattedValue.length < 6) {
        if (!errors.find((err) => err.message === 'Password must be at least 6 characters long')) {
          setErrors([
            ...errors,
            {
              message: 'Password must be at least 6 characters long',
              field: name,
            },
          ]);
        }
      }
    }
    if (name.toLowerCase().includes('email')) {
      // validate email
      // I got this regex pattern from the internet because email validation is tricky
      if (
        !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(formattedValue)
      ) {
        if (!errors.find((err) => err.message === 'Email must be valid')) {
          setErrors([...errors, { message: 'Email must be valid', field: name }]);
        }
      }
    }
  }

  function updateValue(e) {
    const { value } = e.target;
    setValues({ ...values, [e.target.name]: value });
  }

  return { values, updateValue, submitForm, validateFormField, errors };
};

export default useForm;
