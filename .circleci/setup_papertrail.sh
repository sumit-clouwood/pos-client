#! /bin/bash
# SET HOSTNAME ACCORDINGLY TO BE UNIQUE WITHIN PAPERTRAIL
#wget http://s3.amazonaws.com/ec2metadata/ec2-metadata
#chmod 777 ec2-metadata
#INSTANCE_ID=$(./ec2-metadata -i | cut -b 14-)
#HOSTNAME=$PROFILE-$INSTANCE_ID-<BUILDID>
HOSTNAME=<APP>-<ENVIRONMENT>
echo $HOSTNAME > /etc/hostname

# SETUP PAPERTRAIL
wget -qO - --header="X-Papertrail-Token: vKq7LsMYOJAo9lPBCfY" https://papertrailapp.com/destinations/6213432/setup.sh | bash
wget https://github.com/papertrail/remote_syslog2/releases/download/v0.19/remote-syslog2_0.19_amd64.deb
dpkg -i remote-syslog2_0.19_amd64.deb

# EDIT PAPERTRAIL LOG FILES, COPYING TO CORRECT LOCATION AND EDITING THE HOSTNAME
PAPETRAILCONFIGPATH=/tmp/log_files.yml
sed -i "s/<TAG>/$HOSTNAME/" $PAPETRAILCONFIGPATH
cp /tmp/log_files.yml /etc/log_files.yml -f
