import { useState, useEffect } from "react";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDAlert from "components/MDAlert";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import RolesDropDown from "examples/DropDowns/RolesDropDown";
import LocationDropDown from "examples/DropDowns/LocationDropDown";
import Footer from "examples/Footer";

// Overview page components
import Header from "layouts/user-profile/Header";

import AuthService from "../../services/auth-service";

const UserProfile = () => {
  const [isDemo, setIsDemo] = useState(false);
  const [notification, setNotification] = useState(false);
  const [user, setUser] = useState({
    name: "",
    mobileNo: "",
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    nameError: false,
    mobileNoError: false,
    emailError: false,
    newPassError: false,
    confirmPassError: false,
  });

  const getUserData = async () => {
    const response = await AuthService.getProfile();
    if (response.data.id == 1) {
      setIsDemo(process.env.REACT_APP_IS_DEMO === "true");
    }
    setUser((prevUser) => ({
      ...prevUser,
      ...response.data.attributes,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));
  };

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    if (notification === true) {
      setTimeout(() => {
        setNotification(false);
      }, 5000);
    }
  }, [notification]);

  const changeHandler = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,

    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // validation
    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (user.name.trim().length === 0) {
      setErrors({ ...errors, nameError: true });
      return;
    }

    if (user.mobileNo.trim().length === 0) {
      setErrors({ ...errors, mobileNoError: true });
      return;
    }

    if (user.email.trim().length === 0 || !user.email.trim().match(mailFormat)) {
      setErrors({ ...errors, emailError: true });
      return;
    }

    if (user.confirmPassword || user.newPassword) {
      // in the api the confirmed password should be the same with the current password, not the new one
      if (user.confirmPassword.trim() !== user.newPassword.trim()) {
        setErrors({ ...errors, confirmPassError: true });
        return;
      }
      if (user.newPassword.trim().length < 8) {
        setErrors({ ...errors, newPassError: true });
        return;
      }
    }

    let userData = {
      data: {
        type: "profile",
        attributes: {
          name: user.name,
          mobileNo: user.mobileNo,
          email: user.email,
        },
      },
    };

    // set new user data for call
    if (user.newPassword.length > 0) {
      userData = {
        data: {
          type: "profile",
          attributes: {
            name: user.name,
            mobileNo: user.mobileNo,
            email: user.email,
            password: user.newPassword,
            password_confirmation: user.confirmPassword,
          },
        },
      };
    }

    // call api for update
    const response = await AuthService.updateProfile(JSON.stringify(userData));

    // reset errors
    setErrors({
      nameError: false,
      mobileNoError: false,
      emailError: false,
      passwordError: false,
      newPassError: false,
      confirmPassError: false,
    });

    setNotification(true);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <Header name={user.name}>
        {notification && (
          <MDAlert color="info" mt="20px">
            <MDTypography variant="body2" color="white">
              Your profile has been updated
            </MDTypography>
          </MDAlert>
        )}
        <MDBox
          component="form"
          role="form"
          onSubmit={submitHandler}
          display="flex"
          flexDirection="column"
        >
          <MDBox display="flex" flexDirection="row" mt={5} mb={3}>
            <MDBox
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              width="100%"
              mr={2}
            >
              <MDTypography variant="body2" color="text" ml={1} fontWeight="regular">
                Name
              </MDTypography>
              <MDBox mb={2} width="100%">
                <MDInput
                  type="name"
                  fullWidth
                  name="name"
                  value={user.name}
                  onChange={changeHandler}
                  error={errors.nameError}
                />
                {errors.nameError && (
                  <MDTypography variant="caption" color="error" fontWeight="light">
                    The name can not be null
                  </MDTypography>
                )}
              </MDBox>
            </MDBox>
            <MDBox
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              width="100%"
              ml={2}
            >
              <MDTypography variant="body2" color="text" ml={1} fontWeight="regular">
                Email
              </MDTypography>
              <MDBox mb={1} width="100%">
                <MDInput
                  type="email"
                  fullWidth
                  name="email"
                  value={user.email}
                  onChange={changeHandler}
                  error={errors.emailError}
                  disabled={isDemo}
                />
                {errors.emailError && (
                  <MDTypography variant="caption" color="error" fontWeight="light">
                    The email must be valid
                  </MDTypography>
                )}
              </MDBox>

            </MDBox>
          </MDBox>

          <MDBox display="flex" flexDirection="column" mb={3}>
            <MDBox display="flex" flexDirection="row">
              <MDBox
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
                width="100%"
                mr={2}
              >
                <MDTypography variant="body2" color="text" ml={1} fontWeight="regular">
                  Mobile Number
                </MDTypography>
                <MDBox mb={2} width="100%">
                  <MDInput
                    type="mobileNo"
                    fullWidth
                    name="mobileNo"
                    value={user.mobileNo}
                    onChange={changeHandler}
                    error={errors.mobileNoError}
                  />
                  {errors.mobileNoError && (
                    <MDTypography variant="caption" color="error" fontWeight="light">
                      The mobile number can not be null
                    </MDTypography>
                  )}
                </MDBox>
              </MDBox>

              <MDBox mb={2} width="100%">
                <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '1rem' }}>
                  <RolesDropDown selectedValue="employee" />

                </div>
              </MDBox>



            </MDBox>
          </MDBox>
          <MDBox display="flex" flexDirection="column" mb={3}>
            <MDBox display="flex" flexDirection="row">
              <MDBox
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
                width="100%"
                mr={2}
              >
                <MDTypography variant="body2" color="text" ml={1} fontWeight="regular">
                  New Password
                </MDTypography>
                <MDBox mb={2} width="100%">
                  <MDInput
                    type="password"
                    fullWidth
                    name="newPassword"
                    placeholder="New Password"
                    value={user.newPassword}
                    onChange={changeHandler}
                    error={errors.newPassError}
                    disabled={isDemo}
                    inputProps={{
                      autoComplete: "new-password",
                      form: {
                        autoComplete: "off",
                      },
                    }}
                  />
                  {errors.newPassError && (
                    <MDTypography variant="caption" color="error" fontWeight="light">
                      The password must be of at least 8 characters
                    </MDTypography>
                  )}
                </MDBox>
              </MDBox>
              <MDBox
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
                width="100%"
                ml={2}
              >
                <MDTypography variant="body2" color="text" ml={1} fontWeight="regular">
                  Password Confirmation
                </MDTypography>
                <MDBox mb={1} width="100%">
                  <MDInput
                    type="password"
                    fullWidth
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={user.confirmPassword}
                    onChange={changeHandler}
                    error={errors.confirmPassError}
                    disabled={isDemo}
                    inputProps={{
                      autoComplete: "confirmPassword",
                      form: {
                        autoComplete: "off",
                      },
                    }}
                  />
                  {errors.confirmPassError && (
                    <MDTypography variant="caption" color="error" fontWeight="light">
                      The password confirmation must match the current password
                    </MDTypography>
                  )}
                </MDBox>
                {isDemo && (
                  <MDTypography variant="caption" color="text" ml={1} fontWeight="light">
                    In the demo version the password can not be updated
                  </MDTypography>
                )}
              </MDBox>

              
            </MDBox>
     
            <MDBox mb={2} width="100%">
            <MDBox
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
                width="100%"
                ml={2}
              >
                  <LocationDropDown />

             </MDBox>
              </MDBox>
       
           
            <MDBox mt={4} display="flex" justifyContent="end">
              <MDButton variant="gradient" color="info" type="submit">
                Save changes
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Header>
      <Footer />
    </DashboardLayout>
  );
};

export default UserProfile;
