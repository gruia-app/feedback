@Library('simplia-ci@7ddfd407da0c46ad21b14d96b24871bdaee96c36') _

// CEO1028: the complete verification runs on Contabo2. The shared library
// owns CI execution; ci/app.yml supplies the gates of this package.
simpliaPipeline(
    manifest: 'ci/app.yml',
    agentLabel: 'linux-docker-medium && (capacity-host-id-contabo2 || contabo-primary || linux-docker-fallback-16) && !controller',
    urgentAgentLabel: 'linux-docker-medium && (capacity-host-id-contabo2 || contabo-primary || linux-docker-fallback-16) && !controller'
)
