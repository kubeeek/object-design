The app uses a React router library.

The task was solved as:
* The Home page is a Services page which makes a GET request to the backend.
* The Cart page makes the POST to the backend when user clicks a button.
* The Orders page makes the POST as well the GET request to the backend.

So there are at least 3 components, 1 GET call to get data from a server and 2 POST calls to send the data to the server.

Data manipulation is managed by two hooks: `useReducer` and `useState`. Where the data is being used by more than one component, the state is leveraged to the highest parent (so the `App.jsx`) and the component composition was used instead of Context API/drilling the props.

In order to run everything, please type `npm run start` in the client directory and `npm run start` in the server directory. 

