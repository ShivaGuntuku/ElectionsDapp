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

});