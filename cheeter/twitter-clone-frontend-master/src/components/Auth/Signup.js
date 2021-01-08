import React from "react";
import { useMutation } from "@apollo/react-hooks";
import { toast } from "react-toastify";
import useInput from "../../hooks/useInput";
import Input from ".././Input";
import Button from "../../styles/Button";
import Form from "../../styles/Form";
import { displayError } from "../../utils";
import { SIGNUP } from "../../queries/auth";

export default ({ changeToLogin }) => {
  const Firstname = useInput("");
  const Lastname = useInput("");
  const Handle = useInput("");
  const Email = useInput("");
  const Password = useInput("");

  const [signupMutation, { loading }] = useMutation(SIGNUP, {
    update: (cache, { data: { signup } }) => {
      localStorage.setItem("token", signup.token);
      localStorage.setItem("user", JSON.stringify(signup.user));
      cache.writeData({
        data: {
          isLoggedIn: true,
          user: JSON.parse(localStorage.getItem("user")),
        },
      });
    },
  });

  const handleSignup = async (e) => {
    e.preventDefault();

    if (
      !firstname.value ||
      !Lastname.value ||
      !Handle.value ||
      !Email.value ||
      !Password.value
    ) {
      return toast.error("You need to fill in all the fields to cheet");
    }

    if (
      handle.value === "/" ||
      handle.value === "explore" ||
      handle.value === "settings/profile" ||
      handle.value === "nofications" ||
      handle.value === "bookmarks"
    ) {
      return toast.error("Your handle is not valid, try a different one");
    }

    const re = /^[a-z0-9]+$/i;

    if (re.exec(handle.value) === null) {
      return toast.error(
        "Your handle contains some non-alphanumeric characters, choose a better handle name"
      );
    }

    try {
      await signupMutation({
        variables: {
          Firstname: firstname.value,
          Lastname: lastname.value,
          Handle: handle.value,
          Email: email.value,
          Password: password.value,
        },
      });

      toast.success("You logged in");
    } catch (err) {
      return displayError(err);
    }

    [Firstname, Lastname, Handle, Email, Password].map((field) =>
      field.setValue("")
    );
  };

  return (
    <Form center onSubmit={handleSignup}>
      <div className="group-input">
        <Input
          text=" Your First Name"
          value={firstname.value}
          onChange={firstname.onChange}
        />
        <Input
          text="Your Last Name"
          value={lastname.value}
          onChange={lastname.onChange}
        />
      </div>
      <Input text="Handle" value={handle.value} onChange={handle.onChange} />
      <div className="group-input">
        <Input
          text="Email"
          type="email"
          value={email.value}
          onChange={email.onChange}
        />
        <Input
          text="Password"
          type="password"
          value={password.value}
          onChange={password.onChange}
        />
      </div>
      <Button xl outline disabled={loading} type="submit">
        {loading ? "Signing in" : "Sign up"}
      </Button>
      <span>or</span>
      <Button xl type="button" onClick={changeToLogin}>
        Login
      </Button>
    </Form>
  );
};

// /^[a-z0-9]+$/i
