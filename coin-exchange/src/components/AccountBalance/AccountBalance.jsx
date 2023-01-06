import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Section1 = styled.section`
  font-size: 2rem;
  tex-align: left;
  padding: 1.5rem 0 1.5rem 5rem;
`;

export default class AccountBalance extends Component {
  render() {
    const buttonText = this.props.showBalance ? "Hide Balance" : "Show Balance";
    return (
      <Section1>
        Balance: $ {this.props.amount}
        <button></button>
      </Section1>
    );
  }
}

AccountBalance.propTypes = {
  amount: PropTypes.number.isRequired,
};
