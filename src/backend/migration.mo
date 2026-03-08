module {
  type OldActor = {
    hiddenMarketIntelPassword : Text;
  };

  type NewActor = {
    hiddenMarketIntelPassword : Text;
  };

  public func run(old : OldActor) : NewActor {
    old;
  };
};
