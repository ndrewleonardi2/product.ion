import ApiCall from "../utils/serverCalls";
import store from "../store";
import { push } from "react-router-redux";

function posts(state=[], action) {
  switch (action.type) {
    case "REGISTRATION_CHECK":
      ApiCall.registrationCheck(action.orgName, action.username)
      .catch(function (err) {
        console.log("Should be here");
        var message="", target=0;
        switch (err.response.status) {
          case 400:
            target=3;
            message = ["Sorry, that organization name is taken", "Sorry, that username is taken"];
            break;
          case 401:
            message = "Sorry, that organization name is taken";
            target = 0;
            break;
          case 403:
            message = "Sorry, that username is taken";
            target = 1;
            break;
          default:
            console.error(err);
        }
        store.dispatch({type: "REGISTRATION_ERROR", target:target, message: message});
      })
      .then(function(res){
        if (res && res.status===200) {//put this back when ready
          console.log("Both fields clear. Registering org and user");
          store.dispatch({
            type: "ADD_NEW_ORG",
            orgName: action.orgName,
            username: action.userName,
            password: action.password
          });//register new org.
        } else {
          console.log("Something is wrong. Res is ", res);
        }
      });
      break;
    case "ADD_NEW_ORG":
      console.log("Lets get started. action is ", action);
      ApiCall.registerOrg(action.orgName)
        .catch(function (err) {
          console.error(err);
        })
        .then(function (res) {
           if (res.status === 201) {
            console.log("Step 2 complete. Organization is registered. res is ", res);
            var orgData = res.data;

            ApiCall.registerUser(action.username, action.password, res.data.id, 0)
              .catch(function (err) {
                console.error(err);
              })
              .then(function (res) {
                if (res.status === 201) {
                  var organization = {
                    id: orgData.id,
                    orgs_id: orgData.orgs_id,
                    orgName: orgData.orgName,
                    user: {name: res.data.userName, perm: res.data.perm},
                    users: orgData.users
                  };//build data object with responses from both APIcalls.
                  console.log("Successful server chain. Hydrating an organization with data. ", organization);
                  store.dispatch({
                    type: "HYDRATE_ORG",
                    organization
                  });
                  var joinedName = organization.orgName.split(" ").join("");
                  store.dispatch(push(`/dashboard/${joinedName}`));
                }
              });
          }
        });
      break;
    case "ADD_NEW_USER":
      console.log("So you want to make a new user");
      break;
    case "POST_LOGIN":
      ApiCall.login(action.username, action.password)
        .catch(function(err) {
          store.dispatch({
            type:"SET_LOGIN_MESSAGE",
            message: "Invalid username/password combination. Please try again",
            className: "errorMessage"
          });
          console.error(err);
        })
        .then(function(res) {
          if (res) {
            console.log("reducers/organization/SUBMIT_LOGIN: res is ", res);
            store.dispatch({type:"LOGIN", username: res.data.username, org: res.data.orgs});
            var joinedName = res.data.orgs .name.split(" ").join("");
            store.dispatch(push(`/dashboard/${joinedName}`));
          }
        });
      return state;
    case "LOGIN":
      console.log("You're logging in with data ", action);
      return Object.assign({}, state, {
        users: action.username,
        org: action.org.id,
        orgName: action.org.name
      });
  }
  return state;
}

export default posts;
