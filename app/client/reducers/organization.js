import ApiCall from "./serverCalls";

function posts(state = [], action) {
  switch (action.type) {
    case "ADD_NEW_ORG":
      console.log("You want to register an new org");
      ApiCall.register(action.orgName, action.username, action.password)
        .then(function (res) {
          console.log("Registered an organization. ", res);
        });
      break;
    case "LOGIN":
      ApiCall.login(action.username, action.password)
        .then(function(res) {
          console.log("ding ding", res);
        });
      break;
  }
  return state;
}

export default posts;
