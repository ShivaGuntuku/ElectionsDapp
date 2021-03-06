var Elections = artifacts.require("./Elections.sol");

contract("Elections", function(accounts) {
    var electionsInstance;

    // Test For the Candidates count when contract is deployed
    it("initializes with two candidates", function(){
        return Elections.deployed().then(function(instance) {
            return instance.candidatesCount();
        }).then(function(count){
            assert.equal(count, 2);
        });
    });

    //Test for the Contract with correct value
    it("it initializes with the candidates correct values", function(){
        return Elections.deployed().then(function(instance){
            electionsInstance = instance;
            return electionsInstance.candidates(1);
        }).then(function(candidate){
            assert.equal(candidate[0], 1, "contains the correct id");
            assert.equal(candidate[1], "Candidate 1", "contains correct name");
            assert.equal(candidate[2], 0, "contains the correct vote count");
            return electionsInstance.candidates(2);
        }).then(function(candidate){
            assert.equal(candidate[0], 2, "contains the correct id");
            assert.equal(candidate[1], "Candidate 2", "contains correct name");
            assert.equal(candidate[2], 0, "contains the correct vote count");
        });
    });

    // Test for Vote Casting
    it("allows a voter to cast a vote", function() {
        return Elections.deployed().then(function(instance){
            electionsInstance = instance;
            candidateId = 1;
            return electionsInstance.vote(candidateId, { from : accounts[0]});
        }).then(function(recipt){
            assert.equal(recipt.logs.length, 1, "an event was triggered");
            assert.equal(recipt.logs[0].event, "votedEvent", "the event type is correct");
            assert.equal(recipt.logs[0].args._candidateId.toNumber(), candidateId, "the candidateId is correct");
            return electionsInstance.voters(accounts[0]);
        }).then(function(voted){
            assert(voted, "the voter marked as voted");
            return electionsInstance.candidates(candidateId);
        }).then(function(candidate) {
            var voteCount = candidate[2];
            assert.equal(voteCount, 1, "increment the candidates vote count");
        })
    });

    //Test that the function increments the vote count for the candidate.
    it("throws an exception for invalid candidates", function() {
        return Elections.deployed().then(function(instance) {
          electionInstance = instance;
          return electionInstance.vote(99, { from: accounts[1] })
        }).then(assert.fail).catch(function(error) {
          assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
          return electionInstance.candidates(1);
        }).then(function(candidate1) {
          var voteCount = candidate1[2];
          assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
          return electionInstance.candidates(2);
        }).then(function(candidate2) {
          var voteCount = candidate2[2];
          assert.equal(voteCount, 0, "candidate 2 did not receive any votes");
        });
    });


    // Test to ensure that we prevent double voting:
    it("throws an exception for double voting", function() {
    return Elections.deployed().then(function(instance) {
      electionInstance = instance;
      candidateId = 2;
      electionInstance.vote(candidateId, { from: accounts[1] });
      return electionInstance.candidates(candidateId);
    }).then(function(candidate) {
      var voteCount = candidate[2];
      assert.equal(voteCount, 1, "accepts first vote");
      // Try to vote again
      return electionInstance.vote(candidateId, { from: accounts[1] });
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
      return electionInstance.candidates(1);
    }).then(function(candidate1) {
      var voteCount = candidate1[2];
      assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
      return electionInstance.candidates(2);
    }).then(function(candidate2) {
      var voteCount = candidate2[2];
      assert.equal(voteCount, 1, "candidate 2 did not receive any votes");
    });
  });
});