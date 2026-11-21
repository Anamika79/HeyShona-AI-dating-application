from app.schemas.chat_metrics import ChatMetricsRequest, ChatMessageInput
from app.services.chat_metrics_service import chat_metrics_service


def test_chat_metrics_consent_gate():
    """Verify analysis does not proceed without mutual consent."""
    req = ChatMetricsRequest(
        connection_id="test_conn",
        user_name="Anamika",
        match_name="Dr. Maya Alva",
        messages=[
            ChatMessageInput(sender="user", text="Hello!"),
            ChatMessageInput(sender="match", text="Hi there!"),
            ChatMessageInput(sender="user", text="How are you?"),
        ],
        user_consented=True,
        partner_consented=False,  # Partner has not consented
    )
    res = chat_metrics_service.analyze_chat(req)
    assert res.is_mutual_consent is False
    assert res.momentum is None
    assert res.depth is None


def test_chat_metrics_insufficient_data():
    """Verify analysis requests more messages if fewer than 3 are present."""
    req = ChatMetricsRequest(
        connection_id="test_conn",
        user_name="Anamika",
        match_name="Dr. Maya Alva",
        messages=[
            ChatMessageInput(sender="user", text="Hello!"),
        ],
        user_consented=True,
        partner_consented=True,
    )
    res = chat_metrics_service.analyze_chat(req)
    assert res.is_mutual_consent is True
    assert res.has_sufficient_data is False


def test_chat_metrics_deterministic_and_semantic_insights():
    """Verify deterministic balance and qualitative depth progression."""
    msgs = [
        ChatMessageInput(sender="user", text="Hey Maya, how was your marathon training today?"),
        ChatMessageInput(sender="match", text="It was great! 15km in the morning before rounds. Coffee was essential."),
        ChatMessageInput(sender="user", text="What is your favorite quiet spot in the city to recharge?"),
        ChatMessageInput(sender="match", text="A peaceful specialty cafe where I can read books without notifications."),
    ]
    req = ChatMetricsRequest(
        connection_id="conn_maya",
        user_name="Anamika",
        match_name="Dr. Maya Alva",
        messages=msgs,
        timeframe="7d",
        user_consented=True,
        partner_consented=True,
    )
    res = chat_metrics_service.analyze_chat(req)
    assert res.is_mutual_consent is True
    assert res.has_sufficient_data is True
    assert res.balance is not None
    assert res.balance.user_count == 2
    assert res.balance.match_count == 2
    assert res.balance.user_pct == 50.0
    assert res.depth is not None
    assert res.depth.current_level >= 2
    assert len(res.engagement.indicators) >= 3
    assert len(res.weekly_summary.whats_working) == 3
    assert len(res.deeper_starters) >= 2
    assert "Connection Intelligence" in res.ethical_disclaimer
