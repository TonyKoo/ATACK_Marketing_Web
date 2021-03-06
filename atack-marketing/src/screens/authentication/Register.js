import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import firebase from "../../firebase";
import { useHistory } from "react-router-dom";
import Logo from "../../assets/full-logo.png";
import { withRouter, Link } from "react-router-dom";

const Register = () => {
  const API_CREATE_URL =
    "https://atackmarketingapi.azurewebsites.net/api/User/create";
  const history = useHistory();
  async function handleSubmit(values) {
    return new Promise(async (resolve, reject) => {
      if (values.email.length > 0 && values.password.length > 0) {
        await setTimeout(() => {
          firebase
            .auth()
            .createUserWithEmailAndPassword(values.email, values.password)
            .then((response) => {
              alert(
                " - " +
                  response.user.email +
                  "  Please check email inbox for email verification."
              );

              firebase.auth().currentUser.sendEmailVerification();

              firebase
                .auth()
                .currentUser.getIdTokenResult()
                .then((tokenResponse) => {
                  fetch(API_CREATE_URL, {
                    method: "POST",
                    headers: {
                      Authorization: `Bearer ${tokenResponse.token}`,
                    },
                  }).then((response) => {
                    if (response.status === 201) {
                      firebase.auth().signOut();
                      resolve(response.status);
                    } else {
                      reject(
                        console.log("API ERROR: " + JSON.stringify(response))
                      );
                    }
                  });
                });
            })
            .catch((e) => {
             reject(e.message)
            });
        }, 3000);
      }
    });
  }

  return (
    <div className="auth-container">
      <img className="logo" src={Logo} alt="logo" />
      <div className="auth-wrapper">
        <h1>Register</h1>
        <Formik
          initialValues={{
            email: "",
            password: "",
            confirmPassword: "",
          }}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            try {
              await handleSubmit(values);

              history.push("/Login");
            } catch (error) {
              alert(error);
              resetForm();
              values.password = "";
            }
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string().email().required("Required"),
            password: Yup.string()
              .required("Enter password.")
              .min(6, "Minimum of 6 characters required.")
              .matches(/(?=.*[0-9])/, "Password must contain a number."),
            confirmPassword: Yup.string()
              .oneOf([Yup.ref("password")], "Passwords do not match.")
              .required("Confirm password."),
          })}
        >
          {(props) => {
            const {
              values,
              touched,
              errors,
              isSubmitting,
              handleChange,
              handleBlur,
              handleSubmit,
            } = props;

            return (
              <div>
                <form onSubmit={handleSubmit}>
                  <label htmlFor="email">Email</label>
                  <input
                    name="email"
                    type="text"
                    placeholder="Email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.email && touched.email && "error"}
                  />
                  {errors.email && touched.email && (
                    <div className="input-feedback">{errors.email}</div>
                  )}

                  <label htmlFor="email">Password</label>
                  <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={values.password}
                    onChange={handleChange("password")}
                    onBlur={handleBlur("password")}
                    className={errors.password && touched.password && "error"}
                  />
                  {errors.password && touched.password && (
                    <div className="input-feedback">{errors.password}</div>
                  )}
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    name="password"
                    type="password"
                    placeholder="Confirm Password"
                    value={values.confirmPassword}
                    onChange={handleChange("confirmPassword")}
                    onBlur={handleBlur("confirmPassword")}
                    className={
                      errors.confirmPassword &&
                      touched.confirmPassword &&
                      "error"
                    }
                  />
                  {errors.confirmPassword && touched.confirmPassword && (
                    <div className="input-feedback">
                      {errors.confirmPassword}
                    </div>
                  )}

                  <button type="submit" disabled={isSubmitting}>
                    Register
                  </button>
                </form>
                <p className="auth-link">
                  Already have an account? <Link to="/login">Login</Link>
                </p>
              </div>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};
export default withRouter(Register);
