
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title Thrift Token (THRIFT)
/// @notice A purpose-driven ERC20 token launched to raise awareness and drive action around the global polyester landfill crisis.
///         Each token represents a symbolic unit of the 92 million metric tons of unrecyclable polyester waste polluting landfills worldwide.

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ThriftToken is ERC20, Ownable {
    /// @notice Total global polyester landfill waste (estimated) in metric tons = 92,000,000
    ///         Minted supply is 92,000,000 tokens to reflect each ton of polyester waste
    /// @dev Each token = 1 metric ton of landfill polyester waste for awareness and transparency

    uint256 public constant INITIAL_SUPPLY = 92_000_000 * 10 ** 18; // 92 million tokens with 18 decimals

    constructor() ERC20("Thrift Token", "THRIFT") Ownable(msg.sender) {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
}
