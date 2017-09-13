#!/usr/bin/env bash
# Public keys (corresponding to the private keys below):
# 0: 0xdf08f82de32b8d460adbe8d72043e3a7e25a3b39
# 1: 0x6704fbfcd5ef766b287262fa2281c105d57246a6

echo "starting testrpc..."

# Read block time (only param for now).
blocktime=$@
if [ -z "$blocktime" ]; then
 blocktime=0
fi

# Stop testrpc if it's running (assumes it was started by this script).
testrpc_running() {
  nc -z localhost 8545
}
if testrpc_running; then
  echo "test rpc is running, stopping it..."
  read pid < scripts/data/testrpc_pid
  kill -9 $pid
fi

# Start new customized testrpc.
echo "starting testrpc..."
echo 'blocktime: '$blocktime
testrpc \
    -b $blocktime \
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501200,1000000000000000000000000"  \
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501201,1000000000000000000000000"  \
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501202,1000000000000000000000000"  \
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501203,1000000000000000000000000"  \
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501204,1000000000000000000000000"  \
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501205,1000000000000000000000000"  \
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501206,1000000000000000000000000"  \
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501207,1000000000000000000000000"  \
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501208,1000000000000000000000000"  \
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501209,1000000000000000000000000"  \
    & pid=$!
echo 'testrpc pid: '$pid

# Run truffle migrations.
truffle migrate --reset

# Store process id for later reference.
echo $pid > scripts/data/testrpc_pid