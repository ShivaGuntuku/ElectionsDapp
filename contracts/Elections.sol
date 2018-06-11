pragma solidity ^0.4.20;

contract Elections {
    // Model A Candidate
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }
    
    // Store accounts that have voted
    mapping (address => bool) public voters;
    
    // Store Candidates
    // Fetch Candidate
    mapping (uint => Candidate) public candidates;
    
    // Store Candidates Count
    uint public candidatesCount;

    event votedEvent(uint indexed _candidateId);
    

    constructor () public {
        addCandidate('Candidate 1');
        addCandidate('Candidate 2');
    }

    function addCandidate(string _name) private {
        candidatesCount ++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    function vote(uint _candidateId) public {
        // require that they haven't voted before
        require (!voters[msg.sender]);
        
        //require a valid Candidate
        require (_candidateId > 0 && _candidateId <= candidatesCount);
        
        // record that voter has voted
        voters[msg.sender] = true;

        // update the Candidate Vote Count
      candidates[_candidateId].voteCount ++;

      // trigger voted event
      emit votedEvent(_candidateId);
    }
}
