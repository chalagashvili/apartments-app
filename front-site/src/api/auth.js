const api = process.env.REACT_APP_API_URL;

export const postLogin = data => new Promise((resolve, reject) => {
  fetch(`${api}/auth/signIn`, {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
    },
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data),
  })
    .then(res => resolve(res))
    .catch(err => reject(err));
});

export const postSignUp = data => new Promise((resolve, reject) => {
  fetch(`${api}/auth/signUp`, {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
    },
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data),
  })
    .then(res => resolve(res))
    .catch(err => reject(err));
});
