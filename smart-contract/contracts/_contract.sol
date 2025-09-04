// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

contract LoanSystem is ERC721Holder{
    struct Loan {
        uint256 loanId;
        address borrower;
        uint256 totalAmount;     // Principal + interest decided by backend
        uint256 remainingAmount; // Keeps reducing after each EMI
        bool active;
        bool repaid;
        uint256 collateralTokenId;
    }

    mapping(uint256 => Loan) public loans;       // Track all loans
    mapping(address => uint256) public approvedMax; // Max amount approved by backend/AI

    uint256 public loanCounter;
    address public backend; // Only backend can approve + create loans

    IERC721 public collateralNFT;

    // 🔹 Events
    event BorrowerApproved(address borrower, uint256 maxAmount);
    event LoanRequested(address borrower, uint256 requestedAmount);
    event LoanCreated(uint256 loanId, address borrower, uint256 totalAmount);
    event LoanDisbursed(uint256 loanId, address borrower, uint256 amount);
    event LoanRepaid(uint256 loanId, uint256 emiPaid, uint256 remainingAmount);
    event LoanClosed(uint256 loanId);
    event CollateralPledged(uint256 loanId, uint256 tokenId);
    event CollateralSeized(uint256 loanId, uint256 tokenId);


    modifier onlyBackend() {
        require(msg.sender == backend, "Not authorized: backend only");
        _;
    }

    // needs the nft contract address
    constructor(address _nftContractAddress) {
        backend = msg.sender; // For prototype, deployer is backend
        collateralNFT = IERC721(_nftContractAddress);
    }

    // 🔹 Step 1: Backend approves borrower after AI check
    function approveBorrower(address _borrower, uint256 _maxAmount) external onlyBackend {
        approvedMax[_borrower] = _maxAmount;
        emit BorrowerApproved(_borrower, _maxAmount);
    }

    // 🔹 Step 2: Borrower requests loan (must be ≤ approved max)
    function requestLoan(uint256 _requestedAmount) external {
        require(approvedMax[msg.sender] > 0, "Not approved by backend");
        require(_requestedAmount <= approvedMax[msg.sender], "Exceeds approved limit");

        // Just emit an event, backend will then create the loan
        emit LoanRequested(msg.sender, _requestedAmount);
    }

   function createLoan(address _borrower, uint256 _totalAmount, uint256 _collateralTokenId) external onlyBackend {
        loanCounter++;
        loans[loanCounter] = Loan({
            loanId: loanCounter,
            borrower: _borrower,
            totalAmount: _totalAmount,
            remainingAmount: _totalAmount,
            active: false, // Loan is not active until collateral is received
            repaid: false,
            collateralTokenId: _collateralTokenId // Store the NFT token ID
        });

        emit LoanCreated(loanCounter, _borrower, _totalAmount);
    }

    // 4. NEW FUNCTION: BORROWER PLEDGES NFT
    function pledgeCollateral(uint256 _loanId) external {
        Loan storage loan = loans[_loanId];
        require(msg.sender == loan.borrower, "Only borrower can pledge");
        require(!loan.active, "Collateral already pledged");
        require(loan.collateralTokenId != 0, "Loan does not require collateral");

        // Transfer the NFT from the borrower to this contract
        collateralNFT.safeTransferFrom(msg.sender, address(this), loan.collateralTokenId);
        
        loan.active = true; // Activate the loan now that collateral is secure
        emit CollateralPledged(_loanId, loan.collateralTokenId);
    }

    function disburseLoan(uint256 _loanId) external onlyBackend {
    Loan storage ln = loans[_loanId];
    require(ln.active, "Loan not active");
    require(address(this).balance >= ln.totalAmount, "Not enough funds in contract");

    // Transfer funds to borrower
    (bool sent, ) = payable(ln.borrower).call{value: ln.totalAmount}("");
    require(sent, "Transfer failed");

    emit LoanDisbursed(_loanId, ln.borrower, ln.totalAmount);
    }
    
    function payEMI(uint256 _loanId, uint256 expectedEMI) external payable {
        Loan storage ln = loans[_loanId];
        require(ln.active, "Loan not active");
        require(!ln.repaid, "Already repaid");
        require(msg.sender == ln.borrower, "Only borrower can pay");

       require(msg.value == expectedEMI, "Must pay exact EMI");
       require(ln.remainingAmount >= msg.value, "Overpayment not allowed");

        ln.remainingAmount -= msg.value;

        emit LoanRepaid(_loanId, msg.value, ln.remainingAmount);

        if (ln.remainingAmount == 0) {
            ln.active = false;
            ln.repaid = true;
            emit LoanClosed(_loanId);
             // 4. RELEASE COLLATERAL ON FULL REPAYMENT
            collateralNFT.safeTransferFrom(address(this), ln.borrower, ln.collateralTokenId);
        }
        }

        // 4. NEW FUNCTION: BACKEND SEIZES COLLATERAL ON DEFAULT
    function seizeCollateral(uint256 _loanId) external onlyBackend {
        Loan storage loan = loans[_loanId];
        require(loan.active, "Loan not active");
        require(!loan.repaid, "Loan is repaid");

        // Transfer the NFT from this contract to the backend (the lender)
        collateralNFT.safeTransferFrom(address(this), backend, loan.collateralTokenId);
        loan.active = false; // Deactivate the loan

        emit CollateralSeized(_loanId, loan.collateralTokenId);
    }
    }

    
