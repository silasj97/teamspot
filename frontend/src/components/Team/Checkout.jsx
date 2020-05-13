import React from "react";
import StripeCheckout from "react-stripe-checkout";
import TeamAPI from "components/API/TeamAPI.js";

const STRIPE_PUBLISHABLE_KEY = "pk_test_X20OBRj4crG53yFIaOaoKOMw";

const CURRENCY = "USD";

const dollarToCent = amount => amount * 100;

class Checkout extends React.Component {
  constructor(props) {
    super(props);
    this.onToken = this.onToken.bind(this);
    this.state = { teamId: props.teamId };
  }

  async onToken(token) {
    const stripeToken = token.id;
    try {
      await TeamAPI.payForTeam(this.state.teamId, stripeToken);
    } catch (error) {
      // charge unsuccessful
    }
    window.location.reload();
  }

  render() {
    const { name, description, amount } = this.props;
    return (
      <StripeCheckout
        name={name}
        description={description}
        label="Pay Now"
        amount={dollarToCent(amount)}
        token={this.onToken}
        currency={CURRENCY}
        stripeKey={STRIPE_PUBLISHABLE_KEY}
      />
    );
  }
}

export default Checkout;
