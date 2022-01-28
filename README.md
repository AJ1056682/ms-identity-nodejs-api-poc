# A backend service with nodejs using passport and passport-azure-ad (MSAL) to authorize users and application for calling a protected web API on Azure Active Directory

1. [Overview](#overview)
1. [Scenario](#scenario)
1. [Contents](#contents)


## Overview

This sample demonstrates a Node.js web API using passport and passport-azure-ad (MSAL) to authorize users and application for calling a protected web API on Azure Active Directory

## Scenario
We have users they are split into multiple regions. For example I have below regions.
`['FR', 'BR']` for france and brazil.

These users have different permissions (roles). `["Admin", "User", "Global.Admin"]` and they will be able to browse folders with project content based on their authorization level which is related to a region and a role.
For example :
- Global.Admin can view all folders within All region. 
- Admin can see all folders within these regions only. 
- User can only see his project in his region.

To implement this scenario we have created three types of roles in our app registration `["Admin", "User", "Global.Admin"]` and a role per region (country).
We have attached the following roles and regions for the persons in question.


##TO DO 
`En supposant que l'administrateur régional (`Global.Admin`) que nous avons mentionné comme un rôle personnalisé dans notre application (car il n'y a pas de tel rôle dans le DAA), il est toujours préférable d'utiliser les unités administratives et une approche suggérée serait de créer des groupes séparément pour les utilisateurs de l'administrateur régional,
l'administrateur global et d'attribuer des rôles à ces groupes en conséquence.
Un utilisateur peut être affecté à plusieurs groupes et des rôles peuvent être attribués à des utilisateurs/groupes individuels.
Autorisez les applications en fonction des autorisations de rôle accordées par l'administrateur aux groupes.`