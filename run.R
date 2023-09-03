library(jsonlite)
library(RCurl)

pgf <- function(j,m){
  if(j == m){
    return (m)
  }
  return (1 + (j/m-0.5)/(1-j/m))
}

result <- getURI("http://133.242.168.137/bpim/releases/20230903/6release12.json", .encoding= "UTF-8")
df <- jsonlite::fromJSON(result)
answer <- c("Song title","Coefficient","Std. Error","t value","Pr(>|t|)")

for(i in 1:nrow(df)){
  print("#####################")
  print(df[i,1])
  each <- function(bpi){
    k <- df[i,4] 
    s <- bpi
    z <- df[i,3]
    m <- df[i,15]
    S <- pgf(s,m) / pgf(k,m)
    Z <- pgf(z,m) / pgf(k,m)
    if(s < k){
      return (-log(S) / log(Z))
    }
    return (log(S) / log(Z))
  }
  prefix <- function(bpi){
    #if(bpi < df[i,4]){
    #  return (-100)
    #}
    return (100)
  }
  names <- c(100,90,80,70,60,50,40,30,20,10,0)
  dt <- c( each(df[i,3]),each(df[i,6]),each(df[i,7]),each(df[i,8]),each(df[i,9]),each(df[i,10]),each(df[i,11]),each(df[i,12]),each(df[i,13]),each(df[i,14]),each(df[i,4]) )
  prefixed <- c( prefix(df[i,3]),prefix(df[i,6]),prefix(df[i,7]),prefix(df[i,8]),prefix(df[i,9]),prefix(df[i,10]),prefix(df[i,11]),prefix(df[i,12]),prefix(df[i,13]),prefix(df[i,14]),prefix(df[i,4]) )
  db <- data.frame( names,dt,prefixed ) 
  
  ans <- nls( names ~ prefixed * db$dt^b , start=list( b=1 ),trace=TRUE)
  sum <- summary(ans)$coefficient
  answer <- rbind(answer,c(df[i,1],sum) )
  x <- c(df[i,4],df[i,14],df[i,13],df[i,12],df[i,11],df[i,10],df[i,9],df[i,8],df[i,7],df[i,6],df[i,3])
  y <- c(0,10,20,30,40,50,60,70,80,90,100)
  p <- sum[1,1]
  jpeg(file = paste('./plots/',gsub(":|\"|[*|?|/]","",df[i,1]),'.jpeg',sep=''))
  plot(x,y,main= paste(df[i,1],"(2023/09/03)"),xlab= "EXスコア", ylab= "BPI")
  lines(predict(ans))
  dev.off()
}

write.table(answer,"result.csv",append=F,sep=",",row.names=F,col.names=F)
print("finish")

